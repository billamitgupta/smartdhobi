const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId || !qty || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "productId and qty (>=1) are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive || !product.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    const priceAt = product.customerPrice;

    if (typeof priceAt !== "number") {
      return res.status(400).json({
        success: false,
        message: "Product price is invalid",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0,
      });
    }

    const existingItem = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.qty + qty;

      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Quantity exceeds available stock",
        });
      }

      existingItem.qty = newQty;
    } else {
      cart.items.push({
        product: productId,
        qty,
        priceAt,
      });
    }

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.qty * i.priceAt,
      0
    );

    await cart.save();

    return res.json({
      success: true,
      message: "Added to cart",
      cart,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    return res.json({
      success: true,
      cart: cart || {
        items: [],
        totalAmount: 0,
        currency: "INR",
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const { id: productId } = req.params; 

    if (!qty || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "qty must be >= 1",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive || !product.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Product not available",
      });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested qty exceeds available stock",
      });
    }

    item.qty = qty;

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.qty * i.priceAt,
      0
    );

    await cart.save();

    return res.json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    
    const { id: productId } = req.params; 
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const exists = cart.items.some(
      (i) => i.product.toString() === productId
    );

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.qty * i.priceAt,
      0
    );

    await cart.save();

    return res.json({
      success: true,
      message: "Item removed",
      cart,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
