import mongoose from "mongoose";

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      dbName: "Snapgram",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("Failed to connect to MongoDB");
    console.log("Message: " + e.message);
  }
}

export default connectToMongoDB;
