const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String },
  isApproved: { type: Boolean, default: false }, 
  helpfulCount: { type: Number, default: 0 }
}, { timestamps: true });

reviewSchema.index({ product: 1, user: 1 }, { unique: true }); 

module.exports = mongoose.model('Review', reviewSchema);
