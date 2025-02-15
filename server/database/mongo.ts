import mongoose from "mongoose";
import { DB_URL } from "../config";

const connectDB = async() => {
    try {
       const response = await mongoose.connect(DB_URL);
       console.log('Database connected with ' + response.connection.host + ' successfully ');
    } catch (error: any) {
        console.log('error in connecting database: ', error.essage);
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;