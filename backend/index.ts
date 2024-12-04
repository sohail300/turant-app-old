import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import userRouter from "./routes/user";
import uploadRouter from "./routes/upload";
import infoRouter from "./routes/info";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Healthy Server!");
});

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/info", infoRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
