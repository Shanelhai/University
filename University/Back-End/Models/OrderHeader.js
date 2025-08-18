import mongoose from 'mongoose';

const OrderHeaderSchema = new mongoose.Schema({
  applicationUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderTotal: { type: Number },
  orderDate: { type: Date },
  phoneNumber: { type: String },
  streetAddress: { type: String },
  city: { type: String },
  state: { type: String },
  name: { type: String },
  orderStatus: { type: String, default: 'Pending' },
  paymentStatus: { type: String, default: 'Pending' },
  orderBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderBooking' }, 
});

const OrderHeader = mongoose.model('OrderHeaderFetch', OrderHeaderSchema);

export default OrderHeader;
