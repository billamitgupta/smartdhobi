const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  employeeId: { type: String, required: true, unique: true, index: true },
  designation: { type: String },
  department: { type: String },
  phone: { type: String },
  address: { type: String },
  manager: { type: Schema.Types.ObjectId, ref: 'Employee' },
  isActive: { type: Boolean, default: true },
  permissions: [String] 
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
