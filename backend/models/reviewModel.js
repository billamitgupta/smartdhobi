const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    orderId: {
        type: String,
    },
    userId: {
        type: String,
    },
    providerId: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
}, { timestamps: true });

const ReviewModel = mongoose.model('Review', ReviewSchema);
module.exports = ReviewModel;