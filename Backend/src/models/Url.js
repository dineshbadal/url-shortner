import mongoose from "mongoose"
const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    reqired : true,
  },
  shortcode: {
    type: String,
    required: true,
    unique: true,
  },
  createdDate: {
    type: Date,
    default : Date.now,
  },
  clickCount: {
    type: Number,
    default : 0 
    
  },
  isActive: {
    type : Boolean,
    required: false,
    
  }
  
},{timestamps: true})
const Url = mongoose.model("Url", UrlSchema);
export { Url, mongoose } 