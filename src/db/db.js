const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDb = async()=>{
    try {
        await mongoose.connect(URI);
        console.log("Database Connected");
    } catch (error) {
        console.error("Database Connection Failed");
    }
}

module.exports=connectDb;