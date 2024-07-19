import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI as string);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get("/api/test", async(req: Request, res: Response) => {
  res.json({
    message: "Hello from express server"
  });
});

app.listen(3000, () => {
  console.log("Server is listening on 3000")
})

