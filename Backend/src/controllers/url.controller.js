

// Work that will be perform here 
// 1 cheak the vaildity 
// 2 then know about the send it to service 
// 3 then return back to the client 
import {shortenUrl,expandUrl} from '../service/shortener.service.js'


const toShortUrl  = async (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).json({"message":`Invaild url hai sahi wala url le ke aa bhai please ${url}`})
  }
  

  try {
          console.log(url)
          const parsedUrl = new URL(url);
  
          if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
              return res.status(400).json({
                  message: "Only HTTP and HTTPS URLs are allowed"
              });
          }
  
    console.log("Valid URL:", parsedUrl.href);
    console.log("before service")
    const resultUrl = await shortenUrl(url);
    console.log(resultUrl)
    console.log("after service")
    return res.status(201).json({
            "message": "created url",
            "url":resultUrl
          })
  } catch (error) {
    console.log("Message is form error Block ...", error)
          return res.status(400).json({
              message: "Invalid URL*"
          });
      }
  
}
const toexpandUrl = async (req, res) => {
  const shortId = req.params.id
  console.log(shortId);
  try {
    const originalUrl = await expandUrl(shortId);
    console.log("-------------------------------------------------------")
    console.log("This is original URl : 1", originalUrl, "2")
    console.log(originalUrl)
    console.log(originalUrl.trim())    
    return res.redirect(originalUrl.trim());
  }
  catch (er) {
    console.log(er)
    return res.json({ "message": "error in rediect "})
  }
}

export { toShortUrl , toexpandUrl }