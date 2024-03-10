const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt")
const {v4 : uuidv4} = require("uuid");
const jwt = require("jsonwebtoken")

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
    },
    userId: {
        type: String,
        default:uuidv4()
    },

    profilePicture: {
        type: String,   //cloudinary url
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },

}, { timeStamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userId:this.userId,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


const User = new model("User",userSchema);
module.exports = User;