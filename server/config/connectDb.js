import mongoose from "mongoose";

const connectDb = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connected");
}
export default connectDb;
