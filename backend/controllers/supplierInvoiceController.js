const SupplierInvoice = require('../models/SupplierInvoice');

// Get all supplier invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await SupplierInvoice.find()
            .populate('supplier', 'name email')
            .populate('purchaseOrder', 'orderNumber')
            .populate('goodsReceipt', 'receiptNumber')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching invoices',
            error: error.message
        });
    }
};

// Get single invoice
exports.getInvoice = async (req, res) => {
    try {
        const invoice = await SupplierInvoice.findById(req.params.id)
            .populate('supplier')
            .populate('purchaseOrder')
            .populate('goodsReceipt');

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching invoice',
            error: error.message
        });
    }
};

// Create invoice
exports.createInvoice = async (req, res) => {
    try {
        // Generate invoice number
        const invoiceCount = await SupplierInvoice.countDocuments();
        const invoiceNumber = `INV-${Date.now()}-${invoiceCount + 1}`;

        const invoice = await SupplierInvoice.create({
            ...req.body,
            invoiceNumber
        });

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: invoice
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating invoice',
            error: error.message
        });
    }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await SupplierInvoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Invoice updated successfully',
            data: invoice
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating invoice',
            error: error.message
        });
    }
};

// Mark invoice as paid
exports.markAsPaid = async (req, res) => {
    try {
        const { paidAmount } = req.body;

        const invoice = await SupplierInvoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        invoice.paidAmount = paidAmount || invoice.totalAmount;
        invoice.status = 'Paid';
        invoice.paymentDate = new Date();

        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Invoice marked as paid',
            data: invoice
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating invoice payment',
            error: error.message
        });
    }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await SupplierInvoice.findByIdAndDelete(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting invoice',
            error: error.message
        });
    }
};
