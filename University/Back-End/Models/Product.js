import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
  },
  { timestamps: true }

);

const ProductModels = mongoose.model("product", ProductSchema);
export default ProductModels;