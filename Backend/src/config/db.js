// connect of data will done here 
import { mongoose } from "../models/Url.js"
import 'dotenv/config'; 
const databaseUrl = process.env.DATABASE_URL;

// console.log("-----------------DATABASE URL ----------------")
// console.log(databaseUrl)
const connectdb = async () => {
  try {
    await mongoose.connect(databaseUrl);
    console.log("database connected")
  } catch (error) {
    console.log("Error Aa Gayi hai ", error);
    process.exit(1);
  }
}
export default connectdb;