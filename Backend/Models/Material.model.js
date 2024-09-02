import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Material = mongoose.model("Material", materialSchema);
