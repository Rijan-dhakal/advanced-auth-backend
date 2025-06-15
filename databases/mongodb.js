import mongoose from "mongoose";

export const connectDB = async () => {
    try{

        const connect = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`Database connection successful...${connect.connection.host}`);

    } catch(err){
        console.log(`Error connecting mongodb : ${err.message}`);
        process.exit(1);
    }
}