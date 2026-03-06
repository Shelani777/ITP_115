const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private/Admin
exports.createSupplier = async (req, res) => {
  try {
    const supplierData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Generate supplier code
    const count = await Supplier.countDocuments();
    supplierData.supplierCode = `SUP${(count + 1).toString().padStart(4, '0')}`;

    const supplier = await Supplier.create(supplierData);
    res.status(201).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
exports.getSuppliers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category,
      rating,
      search 
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (category) query.categories = category;
    if (rating) query.supplierRating = { $gte: parseInt(rating) };
    if (search) {
      query.$text = { $search: search };
    }

    const suppliers = await Supplier.find(query)
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Supplier.countDocuments(query);

    res.json({
      success: true,
      data: suppliers,
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

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      });
    }

    const purchaseOrders = await PurchaseOrder.find({ supplier: supplier._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        supplier,
        recentOrders: purchaseOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user.id
      },
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      });
    }

    const activeOrders = await PurchaseOrder.findOne({
      supplier: supplier._id,
      status: { $in: ['pending_approval', 'approved', 'sent_to_supplier'] }
    });

    if (activeOrders) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete supplier with active purchase orders'
      });
    }

    supplier.status = 'inactive';
    supplier.updatedBy = req.user.id;
    await supplier.save();

    res.json({
      success: true,
      message: 'Supplier deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
