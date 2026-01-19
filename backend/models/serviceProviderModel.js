const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dhobiId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    owner: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    serviceAreas: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    commissionRate: { type: Number, required: true, min: 0, max: 100 },
    services: [
      {
        name: String,
        price: String,
      },
    ],
    joinDate: { type: String },
    rating: { type: Number, default: 0 },
    ordersCompleted: { type: Number, default: 0 },
    pricing: {
      type: Map,
      of: Number,
    },
    images: [{ type: String }],
    isApproved: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    isActive: { type: Boolean, default: true },
    earnings: { type: String },
  },
  { timestamps: true }
);

// Create a 2dsphere index for geospatial queries
ServiceProviderSchema.index({ location: "2dsphere" });

// Generate dhobiId before saving
ServiceProviderSchema.pre("validate", async function (next) {
  if (!this.dhobiId) {
    const last = await this.constructor.findOne().sort({ dhobiId: -1 }).select("dhobiId");
    this.dhobiId = last && last.dhobiId ? last.dhobiId + 1 : 1;
  }
  next();
});

const ServiceProvider = mongoose.model("ServiceProvider", ServiceProviderSchema);
module.exports = ServiceProvider;
