const mongoose = require('mongoose');
const Category = require('../../models/Category');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name required" });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (err) {
    console.error("createCategory error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// List Categories
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      success: true,
      data: categories
    });

  } catch (err) {
    console.error("listCategories error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid id" });

    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({
      success: true,
      message: "Category updated",
      data: updated
    });

  } catch (err) {
    console.error("updateCategory error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid id" });

    const removed = await Category.findByIdAndDelete(id);

    if (!removed)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted" });

  } catch (err) {
    console.error("deleteCategory error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
