const SupplierInvoice = require('../models/SupplierInvoice');
const PurchaseOrder = require('../models/PurchaseOrder');

// @desc    Create supplier invoice
// @route   POST /api/supplier-invoices
// @access  Private
exports.createSupplierInvoice = async (req, res) => {
  try {
    const invoiceData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Check if invoice already exists for this supplier
    const existingInvoice = await SupplierInvoice.findOne({
      supplier: invoiceData.supplier,
      invoiceNumber: invoiceData.invoiceNumber
    });

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        error: 'Invoice number already exists for this supplier'
      });
    }

    const invoice = await SupplierInvoice.create(invoiceData);

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all supplier invoices
// @route   GET /api/supplier-invoices
// @access  Private
exports.getSupplierInvoices = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      supplier,
      fromDate,
      toDate 
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (supplier) query.supplier = supplier;
    if (fromDate || toDate) {
      query.invoiceDate = {};
      if (fromDate) query.invoiceDate.$gte = new Date(fromDate);
      if (toDate) query.invoiceDate.$lte = new Date(toDate);
    }

    const invoices = await SupplierInvoice.find(query)
      .populate('supplier', 'companyName')
      .populate('purchaseOrder', 'poNumber')
      .populate('createdBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await SupplierInvoice.countDocuments(query);

    // Calculate totals
    const totals = await SupplierInvoice.aggregate([
      { $match: query },
      { $group: {
        _id: null,
        totalAmount: { $sum: '$totalAmount' },
        paidAmount: { 
          $sum: { 
            $cond: [{ $eq: ['$status', 'paid'] }, '$totalAmount', 0] 
          }
        },
        pendingAmount: { 
          $sum: { 
            $cond: [{ $in: ['$status', ['pending_verification', 'verified', 'approved']] }, '$totalAmount', 0] 
          }
        }
      }}
    ]);

    res.json({
      success: true,
      data: invoices,
      summary: totals[0] || { totalAmount: 0, paidAmount: 0, pendingAmount: 0 },
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

// @desc    Update invoice payment status
// @route   PUT /api/supplier-invoices/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentDate, amount, method, reference } = req.body;

    const invoice = await SupplierInvoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    invoice.paymentHistory.push({
      paymentDate: paymentDate || new Date(),
      amount,
      method,
      reference,
      notes: req.body.notes
    });

    const totalPaid = invoice.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    
    if (totalPaid >= invoice.totalAmount) {
      invoice.paymentStatus = 'paid';
      invoice.status = 'paid';
    } else if (totalPaid > 0) {
      invoice.paymentStatus = 'partial';
      invoice.status = 'partially_paid';
    }

    await invoice.save();

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};