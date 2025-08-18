import mongoose from 'mongoose';
import OrderBooking from '../Models/OrderBooking.js';
import OrderHeader from '../Models/OrderHeader.js';

export const getOrderHeader = async (req, res) => {
  try {
    const { orderBookingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderBookingId)) {
      return res.status(400).json({ error: 'Invalid OrderBooking ID' });
    }
    const orderBooking = await OrderBooking.findById(orderBookingId);
    if (!orderBooking) {
      return res.status(404).json({ error: 'OrderBooking not found' });
    }
    const newOrderHeader = new OrderHeader({
      applicationUser: orderBooking.applicationUser,
      orderTotal: orderBooking.totalAmount,
      orderDate: new Date(),
      phoneNumber: orderBooking.phone,
      streetAddress: orderBooking.shippingAddress,
      city: orderBooking.city,
      state: orderBooking.state,
      name: orderBooking.userName,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      orderBooking: orderBooking._id,
    });
    const savedOrderHeader = await newOrderHeader.save();

    console.log('✅ OrderHeaderFetch saved:', savedOrderHeader._id);

    res.status(201).json({
      message: 'Order header created successfully',
      orderHeader: savedOrderHeader,
    });
  } catch (error) {
    console.error('❌ Error creating OrderHeader:', error);
    res.status(500).json({
      error: 'Failed to create OrderHeader',
      details: error.message,
    });
  }
};

export const getOrderHeaderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid OrderHeader ID' });
    }

    const orderHeader = await OrderHeader.findById(id)
      .populate('applicationUser', 'name email')
      .populate('orderBooking', 'shippingAddress userName userEmail totalAmount');

    if (!orderHeader) {
      return res.status(404).json({ error: 'OrderHeader not found' });
    }

    res.status(200).json(orderHeader);
  } catch (error) {
    console.error('❌ Error fetching OrderHeader by ID:', error);
    res.status(500).json({
      error: 'Failed to fetch OrderHeader',
      details: error.message,
    });
  }
};

export const getAllOrderHeaders = async (req, res) => {
  try {
    const orderHeaders = await OrderHeader.find()
      .populate('applicationUser', 'name email')
      .populate('orderBooking', 'shippingAddress userName userEmail totalAmount');

    res.status(200).json(orderHeaders);
  } catch (error) {
    console.error('❌ Error fetching all OrderHeaders:', error);
    res.status(500).json({ error: 'Failed to fetch OrderHeaders' });
  }
};


export const deleteOrderHeader = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid OrderHeader ID' });
    }

    const deletedOrderHeader = await OrderHeader.findByIdAndDelete(id);

    if (!deletedOrderHeader) {
      return res.status(404).json({ error: 'OrderHeader not found' });
    }

    res.status(200).json({ message: 'OrderHeader deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting OrderHeader:', error);
    res.status(500).json({ error: 'Failed to delete OrderHeader' });
  }
};
