import express from 'express'
import { registerUser,loginUser, myProfile, userProfile, followAndUnfollowUser, logOutUser } from '../controllers/userControllers.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser);
router.get("/logout", isAuth, logOutUser); //why to use this only here , if i change the position the code is not working.
router.get("/me", isAuth, myProfile );
router.get("/:id", isAuth, userProfile ); //  :id is params(id will replace by original user id) 
router.post("/follow/:id", isAuth, followAndUnfollowUser ); // :id is params 

export default router;