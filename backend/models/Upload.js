const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  filename: String,
  url: String,
  size: Number,
  mimeType: String,
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  purpose: { type: String, enum: ['product_image', 'profile_pic', 'other'], default: 'other' }
}, { timestamps: true });

module.exports = mongoose.model('Upload', uploadSchema);
