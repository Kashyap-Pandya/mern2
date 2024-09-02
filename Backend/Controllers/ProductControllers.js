import { Product } from "../Models/Product.model.js";
import { Category } from "../Models/Category.model.js";
import { Material } from "../Models/Material.model.js";
import { ProductMedia } from "../Models/ProductMedia.model.js";
import bcrypt from "bcryptjs";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
import crypto from "crypto";

// GET Products
export const getProductsWithPriceRange = async (req, res) => {
  try {
    // Fetch products
    const products = await Product.find({})
      .populate("category")
      .populate("material")
      .populate("image");

    // Fetch price range data
    const priceRangeResults = await Product.aggregate([
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 500, 1000, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
      {
        $project: {
          _id: 0,
          priceRange: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "0-500" },
                { case: { $eq: ["$_id", 500] }, then: "501-1000" },
                { case: { $eq: ["$_id", 1000] }, then: "1000+" },
              ],
              default: "Unknown",
            },
          },
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      products,
      priceRanges: priceRangeResults,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching data",
      error: error.message,
    });
  }
};

// GET Single Product
export const getSingleProduct = async (req, res) => {
  if (!req.params)
    return res
      .status(404)
      .json({ message: `Error while finding product for requested Id` });
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("category")
      .populate("material")
      .populate("image");

    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching the data", error: error.message });
  }
};

// POST Product
export const createProduct = async (req, res) => {
  try {
    let { categoryData, materialData, name, price, status } = req.body;
    categoryData = JSON.parse(req.body.categoryData);
    materialData = JSON.parse(req.body.materialData);

    const generateRandomSKU = async () => {
      let sku;
      let skuExists = true;

      while (skuExists) {
        sku = crypto.randomBytes(10).toString("hex"); // Generate a 20-character SKU
        skuExists = await Product.exists({ sku }); // Check if the SKU already exists in the database
      }

      return sku;
    };

    // Generate a unique SKU
    let sku = await generateRandomSKU();

    price = parseFloat(price);
    const category = new Category({ name: categoryData.name });
    const material = new Material({ name: materialData.name });

    // Handle image upload
    let image = null;
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      const imageUrl = result.secure_url;
      image = new ProductMedia({ image: imageUrl });
      await image.save();
    }

    await category.save();
    await material.save();

    // Hash SKU
    const saltRounds = 10;
    const hashedSKU = await bcrypt.hash(sku, saltRounds);

    console.log(hashedSKU);

    // Create and save Product
    const productData = {
      category: category._id,
      material: material._id,
      image: image ? image._id : null,
      sku: hashedSKU,
      name,
      price,
      status,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

// PATCH Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { categoryData, materialData, sku, name, price, status } = req.body;

    if (!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }

    // Parse JSON strings
    categoryData = JSON.parse(req.body.categoryData);
    materialData = JSON.parse(req.body.materialData);

    const existingProduct = await Product.findById(id)
      .populate("category")
      .populate("material")
      .populate("image");

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { category, material, image } = existingProduct;

    // Update Category
    const updatedCategory = await Category.findByIdAndUpdate(
      category._id,
      { name: categoryData.name },
      { new: true }
    );

    // Update Material
    const updatedMaterial = await Material.findByIdAndUpdate(
      material._id,
      { name: materialData.name },
      { new: true }
    );

    // Handle image update
    let updatedImage = image;
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      const imageUrl = result.secure_url;

      // Update existing image
      updatedImage = await ProductMedia.findByIdAndUpdate(
        image._id,
        { image: imageUrl },
        { new: true }
      );
    }

    const updatedData = {
      category: updatedCategory._id,
      material: updatedMaterial._id,
      sku,
      name,
      price: parseFloat(price),
      status,
      image: updatedImage ? updatedImage._id : null,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    })
      .populate("category")
      .populate("material")
      .populate("image");

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!req.params.id) {
    return res
      .status(400)
      .json({ message: "Please provide the product ID to delete" });
  }

  try {
    const product = await Product.findById(id);
    console.log(product);
    const { category, material, image } = product;
    await Category.findByIdAndDelete(category);
    await Material.findByIdAndDelete(material);
    await ProductMedia.findByIdAndDelete(image);
    await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product Deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error occurred while deleting product: ${error}` });
  }
};
