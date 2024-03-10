const {v2:cloudinary} = require("cloudinary");
const fs = require("fs")


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);  //remove the temporary saved file on local server if upload operation got failed
        return null;
    }
}

const deleteExistingCloudinaryFile=async(cloudinaryFilePath)=>{
    try {
        if(!cloudinaryFilePath){
            return null;
        }
        const response =await cloudinary.uploader.destroy(cloudinaryFilePath,{resource_type: "auto",invalidate:true});
        return null;
    } catch (error) {
        return null;
    }
}
module.exports = {uploadOnCloudinary,deleteExistingCloudinaryFile};