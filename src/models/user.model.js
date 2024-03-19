import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        index:true,
    },

    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        
    },

    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },

   avatar:{
        type:String,
        required:true,
       
    },

    coverImage:{
        type:String,
        required:true,
       
    },

    watchHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },

    password:{
        type:String,
        required:[true,"Password is required."],
    },

    refreshToken:{
        type:String,
    },
},{timestamps:true});


userSchema.pre("save",async function(next){

    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.isPasswordCorrect=async function(password){
    await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema);