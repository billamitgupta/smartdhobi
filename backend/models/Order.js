const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  sku: { type: String },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },      
  total: { type: Number, required: true },
  attributes: Schema.Types.Mixed,
  dealer: { type: Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const dealerAssignSchema = new Schema({
  dealer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedAt: { type: Date, default: Date.now },
  notes: { type: String }
}, { _id: false });

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  dealerAssign: {
    type: dealerAssignSchema,
    default: null
  },
  subTotal: { type: Number, required: true },
  shippingCharges: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  address: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  status: {
    type: String,
    enum: [
      'order_placed',
      'processing',
      'packed',
      'ready_for_dispatch',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned'
    ],
    default: 'order_placed',
    index: true
  },
  timeline: [{
    status: String,
    notes: String,
    changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    at: { type: Date, default: Date.now }
  }],
  isPaid: { type: Boolean, default: false },
  meta: Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
