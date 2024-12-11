import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import userRouter from "./routes/user";
import uploadRouter from "./routes/upload";
import infoRouter from "./routes/info";

import webAuthRouter from "./web/routes/auth";
import webUserRouter from "./web/routes/user";
import webReporterRouter from "./web/routes/reporter";
import webAdRouter from "./web/routes/ad";
import dotenv from "dotenv";
import { authenticate } from "./middlewares/authenticate";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Healthy Server!");
});

app.get("/api/web/me", authenticate, (req, res) => {
  res.json({
    userId: req.headers.userId,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/info", infoRouter);
app.use("/api/web/auth", webAuthRouter);
app.use("/api/web/user", webUserRouter);
app.use("/api/web/reporter", webReporterRouter);
app.use("/api/web/ad", webAdRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
