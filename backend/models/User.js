const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  mobile: { type: String, required: false, trim: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin', 'employee', 'dealer'], default: 'customer', index: true },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  profilePic: { type: String },
  pinCode: { type: Number },
  storeAddress: { type: String },
  panCard: { type: String },
  aadharCard: { type: String },
  storeGstin: { type: String },
  storeName: { type: String },
  meta: {
    lastLoginAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
