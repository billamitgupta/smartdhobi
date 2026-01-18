const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['refresh', 'reset_password', 'email_verification', 'otp'], default: 'refresh' },
  token: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
  meta: Schema.Types.Mixed,
  used: { type: Boolean, default: false }
}, { timestamps: true });

tokenSchema.index({ token: 1, type: 1 });
module.exports = mongoose.model('Token', tokenSchema);
