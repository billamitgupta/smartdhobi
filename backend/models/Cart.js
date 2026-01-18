const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, default: 1, min: 1 },
  priceAt: { type: Number, required: true },
  attributes: Schema.Types.Mixed 
}, { _id: false });

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
