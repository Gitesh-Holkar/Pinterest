import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import { Pin } from "../models/pinModel.js";

export const createPin = TryCatch(async (req, res) => {
  const { title, pin } = req.body;

  const file = req.file;
  const fileUrl = getDataUrl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Pin.create({
    title,
    pin,
    image: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    owner: req.user._id,
  });

  res.json({
    message: "Pin Created",
  });
});

export const getAllPins = TryCatch(async (req, res) => {
  const pins = await Pin.find().sort({ createdAt: -1 }); //sort in order as they created (ex: latest pin == first pin)
  res.json(pins);
});
export const getSinglePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id).populate("owner", "-password"); //Populate shows all data of owner
  res.json(pin);
});

export const commentOnPin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
  
    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });
  
    pin.comments.push({
      user: req.user._id,
      name: req.user.name,
      comment: req.body.comment,
    });
  
    await pin.save();
  
    res.json({
      message: "Comment Added",
    });
  });

  export const deleteComment = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
  
    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });
  
    if (!req.query.commentId)
      return res.status(404).json({
        message: "Please give comment id",
      });
  
    const commentIndex = pin.comments.findIndex(
      (item) => item._id.toString() === req.query.commentId.toString() // commentId is a keyword in URL
    );
  
    if (commentIndex === -1) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
  
    const comment = pin.comments[commentIndex];
  
    if (comment.user.toString() === req.user._id.toString()) {
      pin.comments.splice(commentIndex, 1);
  
      await pin.save();
  
      return res.json({
        message: "Comment Deleted",
      });
    } else {
      return res.status(403).json({
        message: "You are not owner of this comment",
      });
    }
  });
  
  export const deletePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
  
    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });
  
    if (pin.owner.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });
  
    await cloudinary.v2.uploader.destroy(pin.image.id); // delete pin image from cloudinary
  
    await pin.deleteOne(); // pin is deleted
  
    res.json({
      message: "Pin Deleted",
    });
  });
  
  export const updatePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
  
    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });
  
    if (pin.owner.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });
  
    pin.title = req.body.title;
    pin.pin = req.body.pin;
  
    await pin.save();
  
    res.json({
      message: "Pin updated",
    });
  });