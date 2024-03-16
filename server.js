require("dotenv").config();
const express = require("express");
const app = express();
const connectDb = require("./src/db/db")
const userRouter = require("./src/routes/user.routes")
const postRouter = require("./src/routes/post.routes")
const followRouter = require("./src/routes/follow.routes")
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./src/middlewares/error.middleware");
const PORT = process.env.PORT || 8000;


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/api/v1/users",userRouter);
app.use("/api/v1/users/post",postRouter);
app.use("/api/v1/users/follow",followRouter);

app.use(errorMiddleware);


connectDb().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is listening at ${PORT}`);
    })
})
