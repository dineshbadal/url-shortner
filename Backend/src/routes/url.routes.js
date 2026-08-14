import express from "express"
const route = express.Router();
import { toShortUrl , toexpandUrl} from "../controllers/url.controller.js";
// add middleware then if required and then send to controlleer 
route.post("/url", toShortUrl)
route.get("/url/:id",toexpandUrl)




export  { route }