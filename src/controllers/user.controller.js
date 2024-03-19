import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User}from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser=asyncHandler(async(req,res)=>{

    //get user details from frontend
    const {username,email,fullName,password}=req.body;
   // console.log(email + username + password + fullName);


    //validation not empty
    if([username,email,password,fullName].some( (field)=>field?.trim()==="" )) {

       throw new ApiError(400,"All Fields are required.")
    }

    //check if user already exists
    const existedUser=await User.findOne(
        {
            $or:[{username},{email}]
        }
    );

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }

    
    //check for images and avatar

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    console.log(req.files);

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar field is required.");
    }


    //upload them to cloudinary avatar
    const Avatar      =    await uploadOnCloudinary(avatarLocalPath);
    const coverImage  =    await uploadOnCloudinary(coverImageLocalPath);

    if(!Avatar){
        throw new ApiError(400,"Avatar field is required.")
    }
   
    //create user object- create entry in db
    const user= await User.create(
      {  fullName,
        avatar:Avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username
    }
    )
      //check for user creation
     //remove password and refresh token field from response
    const createdUser=await User.findById({
        _id:user._id
    }).select("-password -refreshToken");
    
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering.")
    }
   
  
    //return response
     return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
     )
})

export {registerUser};