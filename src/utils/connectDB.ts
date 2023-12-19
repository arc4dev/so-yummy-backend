import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xbudkcm.mongodb.net/so-yummy`
    );

    console.log(`Databse connection successful!`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
