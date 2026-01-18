const Address = require("../../models/Address");

exports.addAddress = async (req, res) => {
  try {
    const { label, name, phone, line1, city, state, country, pincode, isDefault } = req.body;

    if (!line1 || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: "line1, city and pincode are required",
      });
    }

    if (phone && phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    const data = {
      user: req.user._id,
      label,
      name,
      phone,
      line1,
      line2: req.body.line2 || "",
      city,
      state,
      country: country || "India",
      pincode,
      isDefault: !!isDefault,
    };

    // If new address is default, remove default from others
    if (data.isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    const address = await Address.create(data);

    return res.json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.listAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id })
      .sort({ isDefault: -1, createdAt: -1 });

    return res.json({ success: true, addresses });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    // If default address is deleted → auto assign next address as default
    const wasDefault = address.isDefault;
    await address.deleteOne();

    if (wasDefault) {
      const nextAddr = await Address.findOne({ user: req.user._id }).sort({
        createdAt: 1,
      });

      if (nextAddr) {
        nextAddr.isDefault = true;
        await nextAddr.save();
      }
    }

    return res.json({
      success: true,
      message: "Address removed successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Remove previous default
    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } }
    );

    address.isDefault = true;
    await address.save();

    return res.json({
      success: true,
      message: "Default address updated",
      address,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
