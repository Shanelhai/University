import { deleteOrderHeader, getAllOrderHeaders, getOrderHeader, getOrderHeaderById } from "../Controller/OrderHeader.js";
import {  getCart, addToCart, removeFromCart} from "../Controller/Shoppingcart.js";
import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } from "../Controller/OrderBooking.js";

const router = express.Router();


// Shoppingcart.
router.post('/shoppingcart', addToCart);
router.get('/shoppingcart', getCart);
router.delete('/shoppingcart/:itemId', removeFromCart);
        
// OrderBooking Routes
router.post("/orderbooking", createOrder);
router.get("/orderbooking", getAllOrders);
router.get("/orderbooking/:id", getOrderById);
router.put("/orderbooking/:id", updateOrder);
router.delete("/orderbooking/:id", deleteOrder);

// Order Header.
router.get('/orderheader', getAllOrderHeaders);
router.get('/orderheader/:orderBookingId', getOrderHeader); 
router.get('/orderheader/details/:id', getOrderHeaderById); 
router.delete('/orderheader/:id', deleteOrderHeader); 



export default router;
