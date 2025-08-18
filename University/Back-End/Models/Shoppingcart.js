import mongoose from "mongoose";

const ShoppingCartSchema = new mongoose.Schema({
  applicationUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Must match User model name exactly
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const ShoppingCart = mongoose.model("ShoppingCart", ShoppingCartSchema);
export default ShoppingCart;
