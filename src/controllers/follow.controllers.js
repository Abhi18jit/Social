const User = require("../models/user.models");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary, deleteExistingCloudinaryFile } = require("../utils/cloudinary");
const { ApiError } = require("../utils/ApiError")
const { ApiResponse } = require("../utils/ApiResponse");
const Follow = require("../models/follow.model");
const mongoose = require("mongoose")





const getAllUsers = asyncHandler(async (req, res) => {
    const id = req.id;
    const allUsers = await User.find({ _id: { $ne: id } }).select("-password");
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

module.exports = { getAllUsers, followUser, getFollowers, getFollowing};
