// ProductControllers.js

import { Product } from "../Models/Product.model.js";
import { ProductMedia } from "../Models/ProductMedia.model.js";

// Function to create a product
export const createProduct = async (req, res) => {
  try {
    const { sku, status, name, category, material, price } = req.body;
    let image;

    if (req.file?.cloudinaryUrl) {
      const newMedia = new ProductMedia({ image: req.file.cloudinaryUrl });
      image = await newMedia.save();
    }

    const newProduct = new Product({
      sku,
      status,
      name,
      category,
      material,
      price,
      image: image ? image._id : null,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Function to get all products with price range
export const getProductsWithPriceRange = async (req, res) => {
  try {
    const products = await Product.find().populate("image");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Function to get a single product by ID
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("image");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Function to update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, status, name, category, material, price } = req.body;
    let image;

    if (req.file?.cloudinaryUrl) {
      const newMedia = new ProductMedia({ image: req.file.cloudinaryUrl });
      image = await newMedia.save();
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        sku,
        status,
        name,
        category,
        material,
        price,
        image: image ? image._id : undefined,
      },
      { new: true }
    ).populate("image");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Function to delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optionally, delete the associated ProductMedia
    if (deletedProduct.image) {
      await ProductMedia.findByIdAndDelete(deletedProduct.image);
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
