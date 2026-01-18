const Product = require('../../models/Product');

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const { title, slug, price, category } = req.body;

    // Validation
    if (!title || !slug || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "title, slug, price, category are required"
      });
    }

    // Check duplicate slug
    const exists = await Product.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists"
      });
    }

    const payload = {
      ...req.body,
      employee: req.user._id,
      dealer: req.body.dealer || null
    };

    const product = await Product.create(payload);
    res.json({ success: true, product });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LIST PRODUCTS (Employee Only)
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find({ employee: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, products });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      employee: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({ success: true, product });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    // Prevent slug overwrite to another product
    if (req.body.slug) {
      const slugExists = await Product.findOne({ 
        slug: req.body.slug,
        _id: { $ne: req.params.id }
      });
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Slug already used by another product"
        });
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, employee: req.user._id },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({ success: true, product });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const { commission, customerPrice } = req.body;

    if (commission === undefined || customerPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: "commission and customerPrice are required",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        commission: Number(commission),
        customerPrice: Number(customerPrice),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Commission updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update commission error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      employee: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({ success: true, message: "Product deleted successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
