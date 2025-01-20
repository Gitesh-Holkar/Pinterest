import jwt from 'jsonwebtoken';
import {User} from "../models/userModel.js"

//middleware to check authorization
export const isAuth = async (req,res, next)=>{
    try {
        const token = req.cookies.token; // to read this we need package called - cookie-parser
        if(!token) return res.status(403).json({
            message:"Please Login",
        })

        const decodeData = jwt.verify(token, process.env.JWT_SEC);

        if(!decodeData) return res.status(403).json({
            message:"Token Expired",
        })

        req.user = await User.findById(decodeData.id);

        next();

    } catch (error) {
        res.status(500).json({
            message:"Please Login",
        }) 
    }
}

