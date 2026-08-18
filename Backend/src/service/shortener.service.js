import { nanoid } from "nanoid"
import { Url } from "../models/Url.js"
import {redis} from "../config/redis.js"
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
 // cheak in redis cache given url is present there or not 
 // redis is storing the string user:<shortcode>  originalurl 
  const result = await redis.get(`User:${shortcode}`);
  if (result) {
    await Url.updateOne(
                { shortcode },
                { $inc: { clickCount: 1 } }
            );
    return result
  }
  
  // Update the no. of Clicks to-do 
  const url = await Url.findOne({ shortcode })
  url.clickCount += 1;
  await url.save();
      
  console.log("this the URL :: ",url)
  const originalUrl = url.url;
  await redis.set(`User:${shortcode}`,originalUrl, "EX",60*5 )
  return originalUrl;
  
}
export { shortenUrl , expandUrl }