import express from "express";
import { route } from "./routes/url.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "../.env")
});

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_HOSTED
];
console.log(process.env.FRONTEND_HOSTED,"This is the frontend hosted");
app.use(
    cors({
        origin: allowedOrigins
    })
);

app.use(express.json());

app.use("/api", route);

app.get("/", (req, res) => {
    res.send("this application is running fine");
});

export default app;