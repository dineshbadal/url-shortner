import express from "express";
import { route } from "./routes/url.routes.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5175",
  }),
);
app.use(express.json());
app.use("/api", route);
app.get("/", (req, res) => {
  res.send("this application is running fine ");
});

export default app;
