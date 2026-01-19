const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
    },
    userId: {
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    services: [{
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,  
            required: true,
        },
        price: {
            type: Number,  
            required: true,
        }
    }],
    pickupAddress: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    // Location fields for pickup (only saved if current location is used)
    pickupLocation: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        },
    },
    // Location fields for delivery (only saved if current location is used)
    deliveryLocation: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        },
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in_progress', 'ready', 'delivered', 'cancelled'],
        default: 'pending',
    },
    pickupTime: {
        type: String,
    },
    deliveryTime: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    amount: {
        type: String,
    },
   
    // Razorpay Integration Fields
    razorpayOrderId: {
        type: String,
        // This will store the order_id from Razorpay
    },
    razorpayPaymentId: {
        type: String,
        // This will store the payment_id from Razorpay after successful payment
    },
    razorpaySignature: {
        type: String,
        // This will store the signature from Razorpay for verification
    },
    paidAt: {
        type: Date,
        // Timestamp when payment was completed
    },
    failureReason: {
        type: String,
        // Store reason if payment fails
    },
   
    // Optional: Refund related fields
    refundId: {
        type: String,
        // Razorpay refund ID if refund is processed
    },
    refundAmount: {
        type: Number,
        // Amount refunded
    },
    refundStatus: {
        type: String,
        enum: ['processed', 'pending', 'failed'],
        // Refund status
    },
    refundedAt: {
        type: Date,
        // Timestamp when refund was processed
    }
}, { timestamps: true });

// Add geospatial indexes for location fields
OrderSchema.index({ pickupLocation: '2dsphere' });
OrderSchema.index({ deliveryLocation: '2dsphere' });

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;