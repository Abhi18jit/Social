const errorMiddleware=(err,req,res,next)=>{
    // console.log(err);
    const statusCode= err.statusCode || 500;
    const message= err.message || "Backend Error";
    const extraDetails=err.extraDetails || "Error from Backend";
    return res.status(statusCode).json({message,extraDetails});
}

module.exports=errorMiddleware;