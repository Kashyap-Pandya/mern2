import mongoose from "mongoose";

const productMediaSchema = new mongoose.Schema({
  image: {
    type: String,
  },
});

export const ProductMedia = mongoose.model("ProductMedia", productMediaSchema);
