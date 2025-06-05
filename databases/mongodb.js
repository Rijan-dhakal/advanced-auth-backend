import mongoose from "mongoose";

export const connectDB = async () => {
    try{

        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`);
        console.log(`Database connection successful...`);

    } catch(err){
        console.log(`Error connecting mongodb : ${err}`);
        process.exit(1);
    }
}