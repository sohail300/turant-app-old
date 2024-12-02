import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Healthy Server!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
