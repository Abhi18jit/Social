const { Router } =require("express");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { createPost, feed, deleteSinglePost, getAllPosts, updatePost } = require("../controllers/post.controllers");


const router = Router();

router.route("/createpost").post(verifyJWT,createPost)
router.route("/feed").get(verifyJWT,feed)
router.route("/detete-post/:id").delete(verifyJWT,deleteSinglePost)
router.route("/getAllPosts").get(verifyJWT,getAllPosts)
router.route("/updatepost/:id").patch(verifyJWT,updatePost)



module.exports = router;