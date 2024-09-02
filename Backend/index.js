import dotenv from "dotenv";
import express from "express";
import connectDB from "./Db/connection.js";
import ProductRoutes from "./Routes/ProductRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config({
  path: "./env",
});

// For `__filename`
const __filename = fileURLToPath(import.meta.url);

// For `__dirname`
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// middleware

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes middleware
app.use("/api/products", ProductRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
