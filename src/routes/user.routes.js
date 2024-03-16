const { Router } =require("express");
const { registerUser, loginUser, logoutUser, getSingleUser, changePassword, updateProfilePicture, updateBio } = require("../controllers/user.controllers");
const { upload } = require("../middlewares/multer.middleware");
const { verifyJWT } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const loginSchema = require("../ZodValidator/login.validator");
const registerSchema = require("../ZodValidator/register.validator");

const router = Router();

router.route("/register").post(upload.single("profilePicture"),validate(registerSchema),registerUser);
router.route("/login").post(validate(loginSchema),loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/getSingleUser").get(verifyJWT,getSingleUser);
router.route("/changepassword").patch(verifyJWT,changePassword);
router.route("/updateProfilePic").patch(verifyJWT,upload.single("profilePicture"),updateProfilePicture);
router.route("/updatebio").patch(verifyJWT,updateBio);


module.exports = router;

