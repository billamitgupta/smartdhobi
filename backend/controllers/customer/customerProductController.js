const Product = require("../../models/Product");
const slugify = require("slugify");

const validateProductFields = (data) => {
  const errors = [];

  if (!data.title) errors.push("Title is required");
  if (!data.price || data.price < 0) errors.push("Price must be >= 0");
  if (!data.slug) errors.push("Slug is required");
  if (!data.category) errors.push("Category is required");
  if (data.offerPrice && data.offerPrice > data.price)
    errors.push("Offer price cannot be greater than price");

  return errors;
};

exports.create = async (req, res) => {
  try {
    const body = req.body;

    // Auto-generate slug
    if (body.title && !body.slug) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    // Validate required fields
    const errors = validateProductFields(body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Check duplicate slug
    const slugExists = await Product.findOne({ slug: body.slug });
    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: "Product slug already exists",
      });
    }

    // Assign creator (dealer/employee)
    body.dealer = req.user.role === "dealer" ? req.user._id : body.dealer;
    body.employee = req.user.role === "employee" ? req.user._id : body.employee;

    const product = await Product.create(body);

    res.json({ success: true, message: "Product created", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    let { page = 1, limit = 20, q } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    if (q) {
      filter.$text = { $search: q };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      page,
      limit,
      total,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const productId = req.params.id;
    const body = req.body;

    // Auto-update slug when title changes
    if (body.title && !body.slug) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    // Validation
    const errors = validateProductFields({ ...body, slug: body.slug });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Check if product exists
    const exists = await Product.findById(productId);
    if (!exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Dealer/employee can update only their products
    if (req.user.role === "dealer" && exists.dealer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Product.findByIdAndUpdate(productId, body, {
      new: true,
    });

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Secure delete
    if (req.user.role === "dealer" && product.dealer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Product.findByIdAndDelete(productId);

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listApproved = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listByDealer = async (req, res) => {
  try {
    const products = await Product.find({ dealer: req.params.dealerId });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listByEmployee = async (req, res) => {
  try {
    const products = await Product.find({ employee: req.params.employeeId });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.search = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({ success: false, message: "Search query missing" });
    }

    const products = await Product.find({
      $text: { $search: q }
    });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
