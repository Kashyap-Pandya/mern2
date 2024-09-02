import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductsWithPriceRange,
  getSingleProduct,
  updateProduct,
} from "../Controllers/ProductControllers.js";

import { upload } from "../middlewares/FIleUpload.js";

const router = express.Router();

// GET Products
router.get("/", getProductsWithPriceRange);

// GET Single Product
router.get("/:id", getSingleProduct);

// POST Product
router.post("/", upload.single("image"), createProduct);

// PATCH Product
router.patch("/:id", upload.single("image"), updateProduct);

// DELETE Product
router.delete("/:id", deleteProduct);

export default router;
