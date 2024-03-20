import {v2 as cloudinary } from "cloudinary"
import fs from "fs"

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env. CLOUDINARY_API_SECRET
});


const uploadOnCloudinary=async(filePath)=>{
    try {
        if(!filePath) return null;

       const response=await cloudinary.uploader.upload(filePath,
        { resource_type:"auto" });
        console.log("uploaded to cloudinary.  "+response.json());

        fs.unlinkSync(filePath);
        return response;


    } catch (error) {
        fs.unlinkSync(filePath);//remove the locally saved temporary file as the upload operation got failed.
        return null;
    }
}

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

export {uploadOnCloudinary};