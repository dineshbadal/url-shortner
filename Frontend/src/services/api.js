import axios from "axios"


const GetShortenUrl = async(url) => {
  console.log(url);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await axios.post(`${backendUrl}/api/url`, {   
        url: url,
    })
    console.log("api respone hai guys :", response.data.url);
    return response.data.url;
  }
  catch (error) {
    console.log("Dinesh bhai error aa gayi ",error)
  }
}
export default GetShortenUrl
