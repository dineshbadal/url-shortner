import { nanoid } from "nanoid"
import { Url } from "../models/Url.js"
// const randomId = nanoid(20)
// console.log(randomId)
const shortenUrl = async (url) => {
  if (!url) return res.status(400).json({
    "message" : "No url found"
  })
  const randomId = nanoid(12);
  // console.log(randomId)
  const savedUrl = await Url.create({url, shortcode:randomId });
  // console.log(savedUrl);
  const shortUrl = `https://url-shortner-ol3q.onrender.com/api/url/${savedUrl.shortcode}`
  return shortUrl;
}
const expandUrl = async (shortcode) => {
  console.log(shortcode)
  // Update the no. of Clicks to-do 
  const url = await Url.findOne({ shortcode })
  url.clickCount += 1;
  await url.save();
      
  console.log("this the URL :: ",url)
  const originalUrl = url.url;
  return originalUrl;
  
}
export { shortenUrl , expandUrl }