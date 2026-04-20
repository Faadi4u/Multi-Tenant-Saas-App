import mongoose from "mongoose";
import { DB_NAME } from "../constant.ts";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`db connected successfully!!! your db name is : ${connectionInstance.connection.name}`);
         
    } catch (error) {
        console.log(`Your db is failed to connect` , error);
    }
}