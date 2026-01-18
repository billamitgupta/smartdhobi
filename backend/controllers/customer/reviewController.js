const Review = require("../../models/Review");
const Product = require("../../models/Product");

// CREATE REVIEW
exports.createReview = async (req, res) => {
  try {
    const { product, rating, title, comment } = req.body;

    // -------- VALIDATIONS --------
    if (!product) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Prevent duplicate review from same user (Schema already enforces, but we handle gracefully)
    const alreadyReviewed = await Review.findOne({ product, user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "You already reviewed this product" });
    }

    // Create review
    const review = await Review.create({
      product,
      rating,
      title,
      comment,
      user: req.user._id,
      isApproved: false // default, for moderation
    });

    res.json({ success: true, message: "Review submitted for approval", review });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LIST REVIEWS FOR A PRODUCT (Only approved reviews)
exports.listReviews = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate("user", "name") // display user name only
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN: APPROVE REVIEW
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review approved", review });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// MARK REVIEW AS HELPFUL
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Marked as helpful", review });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
