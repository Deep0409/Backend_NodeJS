import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path:"./env"
})
// ;(async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//        app.on("error",(error)=>{console.log("error to connect with express  "+error);
//        throw error;});

//        app.listen(process.env.PORT,()=>{
//         console.log(`server started on ${process.env.PORT}`);
//     });
       
//     } catch (error) {
//         console.log("Error h database connection me bhai.   "+ error);
//         throw error;
//     }
// })();

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        const port=process.env.PORT || 8000;
        console.log(`server is started at port ${port}`)
    })
})
.catch((error)=>{
    console.log("mongoDb connection m error Hai  "+ error);
})

