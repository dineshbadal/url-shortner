import express from "express";
import { route } from "./routes/url.routes.js";
import cors from "cors";
import 'dotenv/config'
const app = express();
const frontendHosted = process.env.FRONTEND_HOSTED;
app.use(
  cors({
    origin: frontendHosted,
  }),
);
app.use(express.json());
app.use("/api", route);
app.get("/", (req, res) => {
  res.send("this application is running fine ");
});

export default app;
