const GoodsReceipt = require('../models/GoodsReceipt');
const PurchaseOrder = require('../models/PurchaseOrder');

// @desc    Create goods receipt
// @route   POST /api/goods-receipt
// @access  Private
exports.createGoodsReceipt = async (req, res) => {
  try {
    const receiptData = {
      ...req.body,
      receivedBy: req.user.id
    };

    const purchaseOrder = await PurchaseOrder.findById(receiptData.purchaseOrder);
    if (!purchaseOrder) {
      return res.status(400).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    // Update PO items received quantities
    receiptData.items.forEach(item => {
      const poItem = purchaseOrder.items.find(i => i.partCode === item.partCode);
      if (poItem) {
        poItem.quantity.received += item.quantityReceived;
        poItem.quantity.remaining = poItem.quantity.ordered - poItem.quantity.received;
      }
    });

    // Check if PO is fully received
    const allReceived = purchaseOrder.items.every(
      item => item.quantity.received >= item.quantity.ordered
    );
    
    purchaseOrder.status = allReceived ? 'completed' : 'partially_received';
    purchaseOrder.actualDeliveryDate = new Date();
    await purchaseOrder.save();

    const goodsReceipt = await GoodsReceipt.create(receiptData);

    res.status(201).json({
      success: true,
      data: goodsReceipt
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all goods receipts
// @route   GET /api/goods-receipt
// @access  Private
exports.getGoodsReceipts = async (req, res) => {
  try {
    const { page = 1, limit = 10, purchaseOrder } = req.query;

    const query = {};
    if (purchaseOrder) query.purchaseOrder = purchaseOrder;

    const receipts = await GoodsReceipt.find(query)
      .populate('purchaseOrder', 'poNumber')
      .populate('supplier', 'companyName')
      .populate('receivedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await GoodsReceipt.countDocuments(query);

    res.json({
      success: true,
      data: receipts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};