import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = mongoose.connect(`${process.env.MONGODB_URL}`);
  } catch (error) {
    console.log("MongoDB Connection error : ", error);
    process.exit(1);
  }
};

export default connectDB;
