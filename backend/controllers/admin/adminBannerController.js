const Banner = require("../../models/Banner");
const { uploadImageToCloudinary } = require("../../utils/imageUploader");

exports.createBanner = async (req, res) => {
  try {
    const { title, link, order, isActive } = req.body;

    // 🔹 Validations
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // 🔹 Image validation (SINGLE IMAGE)
    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    const image = req.files.images; // 👈 single image

    // Optional: size check (5MB)
    if (image.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Image size must be less than 5MB",
      });
    }

    // 🔹 Upload to Cloudinary
    const upload = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME || "banners",
      1200,
      600
    );

    if (!upload || !upload.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    // 🔹 Save to DB
    const banner = await Banner.create({
      images: upload.secure_url,  
      alt: title || "Banner image",
      title,
      link,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });

  } catch (error) {
    console.error("createBanner error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.listBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: banners.length, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { title, link, order, isActive } = req.body;

    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

    if (req.file) {
      const upload = await uploadImageToCloudinary(req.file, "banners", 1200, 600);
      if (!upload || !upload.secure_url) return res.status(500).json({ success: false, message: "Image upload failed" });
      banner.imageUrl = upload.secure_url;
    }

    if (title !== undefined) banner.title = title;
    if (link !== undefined) banner.link = link;
    if (order !== undefined) banner.order = order;
    if (isActive !== undefined) banner.isActive = isActive;

    await banner.save();

    res.json({ success: true, message: "Banner updated", banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

    await banner.deleteOne();
    res.json({ success: true, message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
