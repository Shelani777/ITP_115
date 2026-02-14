const PurchaseOrder = require('../models/PurchaseOrder');
const Supplier = require('../models/Supplier');

// @desc    Create purchase order
// @route   POST /api/purchase-orders
// @access  Private
exports.createPurchaseOrder = async (req, res) => {
  try {
    const poData = {
      ...req.body,
      createdBy: req.user.id,
      status: 'draft'
    };

    const supplier = await Supplier.findById(poData.supplier);
    if (!supplier) {
      return res.status(400).json({
        success: false,
        error: 'Supplier not found'
      });
    }

    if (!poData.paymentTerms) {
      poData.paymentTerms = supplier.paymentTerms;
    }

    const purchaseOrder = await PurchaseOrder.create(poData);

    res.status(201).json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private
exports.getPurchaseOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      supplier,
      fromDate,
      toDate,
      priority 
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (supplier) query.supplier = supplier;
    if (priority) query.priority = priority;
    if (fromDate || toDate) {
      query.orderDate = {};
      if (fromDate) query.orderDate.$gte = new Date(fromDate);
      if (toDate) query.orderDate.$lte = new Date(toDate);
    }

    const purchaseOrders = await PurchaseOrder.find(query)
      .populate('supplier', 'companyName contactPerson supplierRating')
      .populate('createdBy', 'name')
      .populate('approvalFlow.approvedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await PurchaseOrder.countDocuments(query);

    const summary = await PurchaseOrder.aggregate([
      { $match: query },
      { $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalValue: { $sum: '$grandTotal' },
        pendingOrders: { 
          $sum: { 
            $cond: [{ $in: ['$status', ['draft', 'pending_approval', 'approved']] }, 1, 0] 
          }
        }
      }}
    ]);

    res.json({
      success: true,
      data: purchaseOrders,
      summary: summary[0] || { totalOrders: 0, totalValue: 0, pendingOrders: 0 },
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

// @desc    Submit for approval
// @route   PUT /api/purchase-orders/:id/submit
// @access  Private
exports.submitForApproval = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    if (purchaseOrder.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Only draft orders can be submitted for approval'
      });
    }

    purchaseOrder.status = 'pending_approval';
    purchaseOrder.approvalFlow = {
      requestedBy: req.user.id,
      requestedDate: new Date()
    };
    purchaseOrder.updatedBy = req.user.id;

    await purchaseOrder.save();

    res.json({
      success: true,
      message: 'Purchase order submitted for approval',
      data: purchaseOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Approve purchase order
// @route   PUT /api/purchase-orders/:id/approve
// @access  Private/Admin
exports.approvePurchaseOrder = async (req, res) => {
  try {
    const { notes } = req.body;
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    if (purchaseOrder.status !== 'pending_approval') {
      return res.status(400).json({
        success: false,
        error: 'Order is not pending approval'
      });
    }

    purchaseOrder.status = 'approved';
    purchaseOrder.approvalFlow = {
      ...purchaseOrder.approvalFlow,
      approvedBy: req.user.id,
      approvedDate: new Date(),
      approvalNotes: notes
    };
    purchaseOrder.updatedBy = req.user.id;

    await purchaseOrder.save();

    res.json({
      success: true,
      message: 'Purchase order approved',
      data: purchaseOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
