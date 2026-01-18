const mongoose = require('mongoose');
const Dealer = require('../../models/Dealer');

exports.listDealers = async (req, res) => {
  try {
    const { page = 1, limit = 50, q, approved } = req.query;
    const skip = (Math.max(1, parseInt(page)) - 1) * Number(limit);
    const filter = {};
    if (typeof approved !== 'undefined') filter.isApproved = approved === 'true';
    if (q) filter.companyName = new RegExp(q, 'i');

    const [dealers, total] = await Promise.all([
      Dealer.find(filter).skip(skip).limit(Number(limit)),
      Dealer.countDocuments(filter)
    ]);

    res.json({ success: true, data: { dealers, total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    console.error('listDealers err', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getDealer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

    const dealer = await Dealer.findById(id).populate('meta.approvedBy', 'name email');
    if (!dealer) return res.status(404).json({ success: false, message: 'Dealer not found' });

    res.json({ success: true, data: dealer });
  } catch (err) {
    console.error('getDealer err', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

    const updated = await Dealer.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Dealer not found' });

    res.json({ success: true, message: 'Dealer updated', data: updated });
  } catch (err) {
    console.error('updateDealer err', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

    const removed = await Dealer.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ success: false, message: 'Dealer not found' });

    res.json({ success: true, message: 'Dealer deleted' });
  } catch (err) {
    console.error('deleteDealer err', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
