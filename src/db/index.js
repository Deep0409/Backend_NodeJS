import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      console.log("connection to DB Successfull "+ connectionInstance.connection.host);

    } catch (error) {
        console.log("mongoDb connection Error  " +error );
        process.exit(1);
    }
}
export default connectDB;