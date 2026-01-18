const mongoose = require('mongoose');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

exports.overview = async (req, res) => {
  try {
    const [ordersCount, totalRevenueResult, productsCount, dealersCount] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'completed'] } } },
        { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
      ]),
      Product.countDocuments(),
      require('../models/Dealer').countDocuments()
    ]);

    const revenue = (totalRevenueResult[0] && totalRevenueResult[0].revenue) || 0;

    res.json({
      success: true,
      data: { ordersCount, revenue, productsCount, dealersCount }
    });
  } catch (err) {
    console.error('overview err', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.salesReport = async (req, res) => {
  try {
    const { from, to, groupBy = 'day' } = req.query;
    const match = {};
    if (from || to) match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);

    const dateFormat = groupBy === 'month' ? { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
      : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };

    const agg = [
      { $match: match },
      { $group: { _id: dateFormat, totalSales: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { _id: 1 } }
    ];

    const rows = await Order.aggregate(agg);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('salesReport err', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.productReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

    // Count how many times product appears in orders
    const rows = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.product': mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$items.product',
          soldQty: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } }
        }
      }
    ]);

    const product = await Product.findById(id).select('title sku price');

    res.json({
      success: true,
      data: { product, report: rows[0] || { soldQty: 0, totalRevenue: 0 } }
    });
  } catch (err) {
    console.error('productReport err', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
