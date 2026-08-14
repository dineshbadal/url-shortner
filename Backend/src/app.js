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
// Origins allowed to access the backend
const allowedOrigins = [
    "http://localhost:5173",           // local dev
    process.env.FRONTEND_HOSTED,      // production frontend (e.g. Vercel)
].filter(Boolean); // remove undefined/null if env var is not set

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. curl, Postman, server-to-server)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS: origin '${origin}' not allowed`));
        },
        credentials: true,
    })
);

app.use(express.json());

app.use("/api", route);

app.get("/", (req, res) => {
    res.send("this application is running fine");
});

export default app;