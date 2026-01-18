const Product = require('../../models/Product');
const Category = require('../../models/Category');
const SubCategory = require('../../models/SubCategory');
const { uploadImageToCloudinary } = require("../../utils/imageUploader");
const { getIO } = require("../../socket");
const Notification = require("../../models/Notification");

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      categoryId,
      subCategoryId,
      dealerPrice,
      stock,
      sku,
      brand,
      shortDescription
    } = req.body;

    if (!title || title.trim() === "")
      return res.status(400).json({ success: false, message: "Title is required" });

    if (!categoryId)
      return res.status(400).json({ success: false, message: "Category ID is required" });

    if (!subCategoryId)
      return res.status(400).json({ success: false, message: "Sub-category ID is required" });

    if (stock != null && stock < 0)
      return res.status(400).json({ success: false, message: "Stock cannot be negative" });

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    const sub = await SubCategory.findOne({ _id: subCategoryId, categoryId });
    if (!sub)
      return res.status(404).json({
        success: false,
        message: "Sub-category not found for selected category"
      });

    let uploadedImages = [];

    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    let images = req.files.images;
    if (!Array.isArray(images)) images = [images];

    if (images.length > 6) {
      return res.status(400).json({
        success: false,
        message: "You can upload maximum 6 images",
      });
    }

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const upload = await uploadImageToCloudinary(
        img,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      if (!upload || !upload.secure_url)
        return res.status(500).json({ success: false, message: "Image upload failed" });

      uploadedImages.push({
        url: upload.secure_url,
        alt: title || "Product image",
        order: i + 1
      });
    }

    const payload = {
      title,
      categoryId,
      subCategoryId,
      dealerPrice,
      stock: stock || 0,
      sku,
      brand,
      shortDescription,
      images: uploadedImages,
      dealerId: req.user._id,
    };

    const product = await Product.create(payload);

    const notification = await Notification.create({
      productId: product._id,
      message: `New Product Added: ${title}`,
      type: "product",
      isRead: false,
    });

    const io = getIO();
    io.emit("receive-notification", {
      message: notification.message,
      type: "product",
      createdAt: notification.createdAt,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.listProducts = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "dealer") {
      filter.dealerId = req.user._id;
    }

    const products = await Product.find(filter)
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .populate("dealerId", "name email");

    res.status(200).json({ success: true, data: products });

  } catch (err) {
    console.error("listProducts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      dealerId: req.user._id
    });

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });

  } catch (err) {
    console.error("getProduct error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    // Restricted fields
    delete updates.isApproved;
    delete updates.approvedAt;
    delete updates.approvedBy;

    let uploadedImages = [];

    // If images exist
    if (req.files && req.files.images) {
      let images = req.files.images;
      if (!Array.isArray(images)) images = [images];

      if (images.length > 6)
        return res.status(400).json({ success: false, message: "Max 6 images allowed" });

      for (let img of images) {
        const upload = await uploadImageToCloudinary(
          img,
          process.env.FOLDER_NAME,
          1000,
          1000
        );

        if (!upload.secure_url)
          return res.status(500).json({ success: false, message: "Failed to upload image" });

        uploadedImages.push(upload.secure_url);
      }

      updates.images = uploadedImages;
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, dealerId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // ---------------- Real-time Socket Event ----------------
    io.emit("product:updated", product);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      dealerId: req.user._id
    });

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // ---------------- Real-time Socket Event ----------------
    io.emit("product:deleted", { id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock == null || stock < 0)
      return res.status(400).json({ success: false, message: "Valid stock value required" });

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, dealerId: req.user._id },
      { stock },
      { new: true }
    );

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // ---------------- Real-time Socket Event ----------------
    io.emit("product:stockUpdated", product);

    res.status(200).json({
      success: true,
      message: "Stock updated",
      data: product
    });

  } catch (err) {
    console.error("updateStock error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
