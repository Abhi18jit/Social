const User = require("../models/user.models");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { ApiError } = require("../utils/ApiError")
const { ApiResponse } = require("../utils/ApiResponse");
const Post = require("../models/post.model");
const Follow = require("../models/follow.model");
const mongoose = require("mongoose");


const registerUser = asyncHandler(async (req, res) => {
    const { fullname, password, username } = req.body;

    if ([fullname, password, username].some((arrEle) => {
        return (arrEle?.trim() === "")
    })) {
        throw new ApiError(400, "All fields are required")
    }


    const existedUser = await User.findOne({ username })
    if (existedUser) {
        throw new ApiError(409, "Username Already Exist")
    }

    let profilePicLocalPath;
    if (req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length > 0) {
        profilePicLocalPath = req.files.profilePicture[0].path;
    }

    const profilePicture = await uploadOnCloudinary(profilePicLocalPath);

    //store in the database
    const user = await User.create({
        fullname,
        profilePicture: profilePicture?.url || "",
        password,
        username: username.toLowerCase()

    })
    const createdUser = await User.findById(user._id).select(
        "-password"
    );


    if (!createdUser) {
        throw new ApiError(500, "Something Went wrong while registering a user");
    }
    const accessToken = await createdUser.generateAccessToken(user._id);

    const options = {
        httpOnly: true,

    }

    return res.status(201).cookie("accessToken", accessToken, options).json(
        new ApiResponse(200, { user: createdUser, accessToken }, "User Registered Successfully")
    );
})

const loginUser = asyncHandler(async (req, res) => {
    //get the data
    const { username, password } = req.body;

    //check for blank username or email field
    if (!username) {
        throw new ApiError(400, "user name or password is required");

    }

    //Searching in the database if user already exist
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(400, "User does not exist");
    }

    //Password checking
    const isPasswordValid = await user.isCorrectPassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = await user.generateAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select('-password');

    const options = {
        httpOnly: true,

    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken
                },
                "User Logged in Successfully"
            )
        )





})

const logoutUser = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true

    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(200, {}, "User Logged Out")
        );
})

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

const getAllDetails = asyncHandler(async (req, res) => {
    const id = req.id;
    const allUsers = await User.find({ _id: { $ne: id } });
    if (!allUsers) {
        throw new ApiError(400, "No users Found");
    }
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    allUsers
                },
                "User Fetched"
            )
        )

})

const followUser = asyncHandler(async (req, res) => {
    const toId = req.params.id;
    const followdata = await Follow.create({
        following: toId,
        follower: req.id
    })
    if (!followdata) {
        throw new ApiError("Something Went wrong Please try again after sometime")
    }
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    followdata
                },
                "User Fetched"
            )
        )

})
const getFollowing = asyncHandler(async (req, res) => {
    const id = req.id;
    const following = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "follower",
                as: "followings",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "following",
                            foreignField: "_id",
                            as: "profile",
                            pipeline: [
                                {
                                    $project:
                                    {
                                        fullname: 1,
                                        username: 1
                                    }
                                }]
                        }
                    },
                    {
                        $addFields: {
                            profile: {
                                $first: "$profile"
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            profile: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                followings: 1
            }
        }
    ]);
    if (following?.length <= 0) {
        throw new ApiError(400, " No followers")
    }
    return res.status(200).json(new ApiResponse(200, following[0], "Followings fetched Successfully"));


})
const getFollowers = asyncHandler(async (req, res) => {
    const id = req.id;

    const followers = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "following",
                as: "followers",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "follower",
                            foreignField: "_id",
                            as: "profile",
                            pipeline: [
                                {
                                    $project:
                                    {
                                        fullname: 1,
                                        username: 1
                                    }
                                }]
                        }
                    },
                    {
                        $addFields: {
                            profile: {
                                $first: "$profile"
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            profile: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                followers: 1
            }
        }
    ]);
    if (followers?.length <= 0) {
        throw new ApiError(400, " No followers")
    }
    return res.status(200).json(new ApiResponse(200, followers[0], "Followers fetched Successfully"));

})

const feed = asyncHandler(async (req, res) => {
    const id = req.id;
    const following = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "follower",
                as: "followings",
                pipeline: [
                    {
                        $lookup: {
                            from: "posts",
                            localField: "following",
                            foreignField: "owner",
                            as: "post"
                        }
                    },
                    {
                        $unwind:"$post"
                    },
                    {
                        $project:{
                            post:1,
                            _id:0
                        }
                    }
                ]

            },

        },
        {
            $project:{
                followings:1,
            }
        }
        
    ])

    return res.status(200).json(new ApiResponse(200, following[0], "Followings fetched Successfully"));
})

module.exports = { registerUser, logoutUser, loginUser, createPost, getAllDetails, followUser, getFollowers, getFollowing, feed };