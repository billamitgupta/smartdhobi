const Wishlist = require("../../models/Wishlist");
const Product = require("../../models/Product");

exports.addWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // ---- VALIDATION ----
    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    // Check product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: []
      });
    }

    // Add product if not already there
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.json({ success: true, message: "Added to wishlist", wishlist });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.listWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("products");

    res.json({
      success: true,
      count: wishlist?.products?.length || 0,
      wishlist
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeWishlist = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID missing" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    // Filter out the product
    wishlist.products = wishlist.products.filter(
      p => p.toString() !== productId
    );

    await wishlist.save();

    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
