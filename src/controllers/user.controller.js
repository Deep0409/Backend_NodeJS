import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User}from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens=async(userId)=>{
    try {
        //check if userId exists
        const user=await User.findById(userId);

        //create the access and refresh tokens 
        const accessToken =user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        //save the refresh token in the db and as we don't have password thus turning off validation of mongodb;
        user.refreshToken=refreshToken;
        user.save({validateBeforeSave:false});

        //return the access and refresh token
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"something went wrong while genrating access and refresh tokens.")
    }
}


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
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    console.log(req.files);

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar field is required.");
    }
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path;
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
});


const loginUser=asyncHandler(async(req,res)=>{

    const {email,username,password}=req.body;
    
    if(!username || !email){
        throw new ApiError(400,"username or email is required");
    }

    const user =await User.findOne({
        $or:[{username},{email}]
    });

    if(!user){
        throw new ApiError(404,"User doesn't exist");
    }

    const isPasswordValid=await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(404,"InValid User Credentials");
    }

    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

    const loggedInUser=await User.findOne(user._id).select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true,
    }
    return res.status(400).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json({

    })
});

export {
    registerUser,
    loginUser,
};