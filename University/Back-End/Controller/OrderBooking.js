import OrderBooking from "../Models/OrderBooking.js";
import OrderHeader from "../Models/OrderHeader.js"; 
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {
    const {
      applicationUser,
      userName,
      userEmail,
      phone,
      city,
      state,
      shippingAddress,
      items,
      totalAmount,
    } = req.body;

    if (
      !applicationUser ||
      !userName ||
      !userEmail ||
      !phone ||
      !city ||
      !state ||
      !shippingAddress ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totalAmount
    ) {
      return res.status(400).json({
        error:
          "Please provide all required fields: user info, items, total amount, phone, and shipping address.",
      });
    }

    const order = new OrderBooking({
      applicationUser,
      userName,
      userEmail,
      phone,
      city,
      state,
      shippingAddress,
      items,
      totalAmount,
      status: "Pending",
    });

    const savedOrder = await order.save();

    const newOrderHeader = new OrderHeader({
      applicationUser: savedOrder.applicationUser,
      orderTotal: savedOrder.totalAmount,
      orderDate: new Date(),
      phoneNumber: savedOrder.phone,
      streetAddress: savedOrder.shippingAddress,
      city: savedOrder.city,
      state: savedOrder.state,
      name: savedOrder.userName,
      orderStatus: "Pending",
      paymentStatus: "Pending",
      orderBooking: savedOrder._id,
    });

    const savedOrderHeader = await newOrderHeader.save();

    console.log("✅ OrderHeader created with ID:", savedOrderHeader._id);

  
    res.status(201).json({
      message: "Order and OrderHeader created successfully.",
      orderBooking: savedOrder,
      orderHeader: savedOrderHeader,
    });

  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ error: "Failed to create order. Please try again later." });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderBooking.find()
      .populate("applicationUser", "name email")
      .populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await OrderBooking.findById(req.params.id)
      .populate("applicationUser", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ error: "Failed to fetch order." });
  }
};


export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await OrderBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: "Failed to update order." });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await OrderBooking.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ error: "Failed to delete order." });
  }
};
