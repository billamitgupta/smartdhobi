const mongoose = require('mongoose');
const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');

// Create SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name || !categoryId)
      return res.status(400).json({ success: false, message: "Name and categoryId required" });

    if (!mongoose.Types.ObjectId.isValid(categoryId))
      return res.status(400).json({ success: false, message: "Invalid categoryId" });

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    // Prevent duplicate subcategories inside same category
    const exists = await SubCategory.findOne({
      name: name.trim(),
      categoryId
    });

    if (exists)
      return res.status(409).json({ success: false, message: "SubCategory already exists in this category" });

    const sub = await SubCategory.create({
      name,
      categoryName: category.name,
      categoryId
    });

    res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      data: sub
    });

  } catch (err) {
    console.error("createSubCategory error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// List SubCategories
exports.listSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const filter = {};
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = categoryId;
    }

    const list = await SubCategory.find(filter)
      .populate("categoryId", "name")
      .sort({ name: 1 });

    res.json({ success: true, data: list });

  } catch (err) {
    console.error("listSubCategories error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update SubCategory
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid id" });

    // Update categoryName if categoryId is changed
    if (payload.categoryId) {
      if (!mongoose.Types.ObjectId.isValid(payload.categoryId)) {
        return res.status(400).json({ success: false, message: "Invalid categoryId" });
      }

      const cat = await Category.findById(payload.categoryId);
      if (!cat) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      payload.categoryName = cat.name;
    }

    const updated = await SubCategory.findByIdAndUpdate(id, payload, { new: true });

    if (!updated)
      return res.status(404).json({ success: false, message: "SubCategory not found" });

    res.json({
      success: true,
      message: "SubCategory updated",
      data: updated
    });

  } catch (err) {
    console.error("updateSubCategory error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete SubCategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid id" });

    const removed = await SubCategory.findByIdAndDelete(id);

    if (!removed)
      return res.status(404).json({ success: false, message: "SubCategory not found" });

    res.json({ success: true, message: "SubCategory deleted" });

  } catch (err) {
    console.error("deleteSubCategory error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Subcategories By Category
exports.getSubcategoryByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }

    // Fetch all subcategories that belong to this category
    const subcategories = await SubCategory.find({ categoryId });

    if (!subcategories.length) {
      return res.status(404).json({
        success: false,
        message: "No subcategories found for this category"
      });
    }

    res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      data: subcategories
    });

  } catch (err) {
    console.error("getSubcategoriesByCategory error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
