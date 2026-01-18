const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  provider: { type: String, enum: ['cashfree', 'stripe', 'razorpay', 'cod', 'other'], default: 'cashfree' },
  providerPaymentId: { type: String }, 
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['initiated', 'pending', 'success', 'failed', 'refunded'], default: 'initiated', index: true },
  method: { type: String }, 
  meta: Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
