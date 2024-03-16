const User = require("../models/user.models");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary, deleteExistingCloudinaryFile } = require("../utils/cloudinary");
const { ApiError } = require("../utils/ApiError")
const { ApiResponse } = require("../utils/ApiResponse");


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

    let profilePicLocalPath = req.file?.path;
    console.log(req.file?.path);

    const profilePicture = await uploadOnCloudinary(profilePicLocalPath);

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
    const { username, password } = req.body;

    if (!username) {
        throw new ApiError(400, "user name or password is required");

    }

    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(400, "User does not exist");
    }

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

const getSingleUser = asyncHandler(async (req, res) => {
    const id = req.id;
    const singleUser = await User.findById(id).select("-password");
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    singleUser
                },
                "User Fetched"
            )
        )

})

const changePassword= asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const id = req.id;
    if(!oldPassword || !newPassword){
        throw new ApiError(400,"Password Is Required!!!");
    }
    const user = await User.findById(req.id);
    const isPasswordValid = await user.isCorrectPassword(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Old Password is Incorrect");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: true });
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password Changed"
            )
        )



})

const updateProfilePicture = asyncHandler(async (req, res) =>{
    let profilePicLocalPath = req.file?.path;
    if(!profilePicLocalPath){
        throw new ApiError(400,"Image is required")
    }
    const user = await User.findById(req.id).select("-password");
    if(user.profilePicture){
        await deleteExistingCloudinaryFile(user.profilePicture);
    }
    const profilePicture = await uploadOnCloudinary(profilePicLocalPath);
    await User.updateOne({_id:req.id},{$set:{profilePicture:profilePicture.url}});
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Profile Pictured Changed"
            )
        )
})

const updateBio = asyncHandler(async(req, res)=>{
    const {bio} = req.body;
    await User.updateOne({_id:req.id},{$set:{bio}});
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Bio Updated"
            )
        )
})




module.exports = {updateBio, updateProfilePicture, changePassword, getSingleUser, registerUser, logoutUser, loginUser };