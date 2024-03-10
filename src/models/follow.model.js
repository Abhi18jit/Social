const { Schema, model } = require("mongoose");

const followSchema = new Schema({
    
    follower: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },

    following: {
        type: Schema.Types.ObjectId,   
        ref:"User"
    }

}, { timeStamps: true });

const Follow = new model("Follow",followSchema);
module.exports = Follow;