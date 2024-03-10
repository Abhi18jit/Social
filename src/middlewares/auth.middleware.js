const { User } = require ("../models/user.models.js");
const { ApiError } = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");


const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        // console.log(token);
        if(!token){
            throw new ApiError(401,"Unauthorized Request");
    
        }
        
    
        const decodedTokenInfo = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedTokenInfo);
        const id = decodedTokenInfo._id;
        // const user = await User.findById(id).select('-password');
    
        // if(!user){
        //     throw new ApiError(401,"Invalid Access token");
        // }
        // console.log(user);
    
        req.id = id;
        next();
    } catch (error) {
        throw new ApiError(401,"Invalid Access tokennn");
    }
})

module.exports = {verifyJWT}