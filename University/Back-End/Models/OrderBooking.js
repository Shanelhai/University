// models/OrderBooking.js

import mongoose from "mongoose";

const OrderBookingSchema = new mongoose.Schema({
  applicationUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      count: Number,
    },
  ],
  status: {
    type: String,
    default: "Pending",
  },
}, { timestamps: true });

const OrderBooking = mongoose.model("OrderBooking", OrderBookingSchema);
export default OrderBooking;
