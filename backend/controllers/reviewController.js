const Review = require('../models/reviewModel');

// POST /api/review/submit — Submit review
exports.submitReview = async (req, res) => {
    try {
        const { orderId, providerId, rating, comment } = req.body;
        const userId = req.user.userId; // assuming you're using auth middleware

        if (!orderId || !providerId || !rating || !comment) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Prevent duplicate reviews for the same order
        const existingReview = await Review.findOne({ orderId, userId });
        if (existingReview) {
            return res.status(400).json({ message: 'Review already submitted for this order' });
        }

        const review = await Review.create({
            orderId,
            userId,
            providerId,
            rating,
            comment,
        });

        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/review/provider/:id — Get provider reviews
exports.getProviderReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ providerId: id }).sort({ createdAt: -1 });

        res.status(200).json({ reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
