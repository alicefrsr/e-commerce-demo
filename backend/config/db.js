import mongoose from 'mongoose';
import colors from 'colors';
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB successfully connected: \nDB name: ${connect.connection.name} \nDB host: ${connect.connection.host}`.cyan);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
