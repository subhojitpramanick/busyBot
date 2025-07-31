import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import conectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// We removed `await conectCloudinary()` from here.

app.use(cors());
app.use(express.json());

// ** NEW **: Add this middleware to connect Cloudinary before your routes.
// This will run for every incoming request.
app.use((req, res, next) => {
  conectCloudinary();
  next();
});

app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use(requireAuth());

app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
