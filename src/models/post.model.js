const { Schema, model } = require("mongoose");

const postSchema = new Schema({
    
    content: {
        type: String,
        required: true,
        trim: true
    },

    owner: {
        type: Schema.Types.ObjectId,   
        ref:"User"
    }

}, { timeStamps: true });

const Post = new model("Post",postSchema);
module.exports = Post;