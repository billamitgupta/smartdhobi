const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  subCategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
  title: { type: String, trim: true },
  shortDescription: { type: String },
  sku: { type: String },
  brand: { type: String },
  dealerId: { type: Schema.Types.ObjectId, ref: 'User' },
  employeeId: { type: Schema.Types.ObjectId, ref: 'User' },
  images: [{ url: String, alt: String, order: Number }],
  customerPrice: { type: Number, min: 0 },
  dealerPrice: { type: Number },
  commission: { type: Number },
  stock: { type: Number, default: 0, min: 0 },
  isApproved: { type: Boolean, default: false },
  approvedAt: Date,
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  weightKg: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
