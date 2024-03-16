const User = require("../models/user.models");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError")
const { ApiResponse } = require("../utils/ApiResponse");
const Post = require("../models/post.model");
const Follow = require("../models/follow.model");
const mongoose = require("mongoose");


const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const id = req.id;
    const user = await User.findById(id).select('-password');

    if (!content) {
        throw new ApiError(400, "Content is Empty");
    }
    const post = await Post.create({
        content,
        owner: user._id
    })

    return res.status(201).json(
        new ApiResponse(200, { post }, "Post Created")
    );


})

const feed = asyncHandler(async (req, res) => {
    const id = req.id;
    console.log(req.id);

    // const following = await User.aggregate([
    //     {
    //         $match: {
    //             _id: new mongoose.Types.ObjectId(id)
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "follows",
    //             localField: "_id",
    //             foreignField: "follower",
    //             as: "followings",
    //             pipeline: [
    //                 {
    //                     $lookup: {
    //                         from: "posts",
    //                         localField: "following",
    //                         foreignField: "owner",
    //                         as: "post"
    //                     }
    //                 },
    //                 {
    //                     $unwind:"$post"
    //                 },
    //                 {
    //                     $project:{
    //                         post:1,
    //                         _id:0
    //                     }
    //                 }
    //             ]

    //         },

    //     },
    //     {
    //         $project:{
    //             followings:1,
    //         }
    //     }

    // ])

    const posts = await Follow.aggregate([
        {
            $match: {
                follower: new mongoose.Types.ObjectId(id),
            }
        },
        {
            $lookup:{
                from:"posts",
                localField:"following",
                foreignField:"owner",
                as:"post",
            }
        },
        {
            $unwind:"$post"
        },
        {
            $sort:{
                "timeStamp":1
            }
        },
        {
            $project: {
                post: 1,
                _id:0
            }
        },
        
        
        

    ]);

    if(!posts){
        throw new ApiError(400,"No posts To Show");
    }
    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched Successfully"));
})

const deleteSinglePost = asyncHandler(async (req,res)=>{
    const id = req.params.id;
    if(!id){
        throw new ApiError(400,"Post Deletion failed!!! ")
    }
    await Post.deleteOne({_id:id});
    return res.status(200).json(new ApiResponse(200, {}, "Posts Deleted"));
})

const getAllPosts = asyncHandler(async(req,res)=>{
    const id = req.id;
    const posts = await Post.find({owner:id});
    return res.status(200).json(new ApiResponse(200, posts, "Posts Fetched"));
    
})

const updatePost = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    if(!id){
        throw new ApiError(400,"Post Updation failed!!! ")
    }
    const {content} = req.body;
    const updatedData = await Post.updateOne({_id:id},{$set:{content}});
    return res.status(200).json(new ApiResponse(200, updatedData, "Posts Updated"));

})

module.exports = {createPost, updatePost, getAllPosts, deleteSinglePost, feed};