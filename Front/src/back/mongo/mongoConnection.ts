import mongoose from "mongoose";

const mongoConnect = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI is missing as an environment variable.");
  }
 await  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log("Connection failed", err);
    });
}

export default mongoConnect;
