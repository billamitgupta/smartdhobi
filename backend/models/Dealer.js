const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dealerId: { type: String, required: true, unique: true, index: true },
  companyName: { type: String, required: true },
  gstNumber: { type: String },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  contactPerson: String,
  phone: String,
  email: String,
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    bankName: String
  },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  meta: {
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);
