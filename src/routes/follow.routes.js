const { Router } =require("express");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { getAllUsers, followUser, getFollowers, getFollowing } = require("../controllers/follow.controllers");


const router = Router();

router.route("/getUsers").get(verifyJWT,getAllUsers)
router.route("/followUser/:id").post(verifyJWT,followUser)
router.route("/getfollowers").get(verifyJWT,getFollowers)
router.route("/getfollowing").get(verifyJWT,getFollowing)



module.exports = router;