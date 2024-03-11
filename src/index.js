const express=require("express");
const app=express();
require("dotenv").config();


app.get("/",(req,res)=>{
  
    res.send("Hello from server");
})

app.listen(process.env.PORT,()=>{
    console.log(`server started on ${process.env.PORT}`);
})