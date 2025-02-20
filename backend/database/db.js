import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/skillSwap");
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(error.message);
  }
};
