const { Router } =require("express");
const { registerUser, loginUser, logoutUser, createPost, getAllDetails, followUser, getFollowers, getFollowing, feed } = require("../controllers/user.controllers");
const { upload } = require("../middlewares/multer.middleware");
const { verifyJWT } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const loginSchema = require("../ZodValidator/login.validator");
const registerSchema = require("../ZodValidator/register.validator");

const router = Router();

router.route("/register").post(upload.fields([{name:"profilePicture"}]),validate(registerSchema),registerUser);
router.route("/login").post(validate(loginSchema),loginUser);
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/createpost").post(verifyJWT,createPost)
router.route("/getUsers").get(verifyJWT,getAllDetails)
router.route("/followUser/:id").post(verifyJWT,followUser)
router.route("/getfollowers").get(verifyJWT,getFollowers)
router.route("/getfollowing").get(verifyJWT,getFollowing)
router.route("/feed").get(verifyJWT,feed)

module.exports = router;

