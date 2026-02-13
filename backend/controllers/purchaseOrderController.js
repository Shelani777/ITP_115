const PurchaseOrder = require('../models/PurchaseOrder');

// Get all purchase orders
exports.getAllPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.find()
            .populate('supplier', 'name email phone')
            .populate('createdBy', 'name email')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: purchaseOrders.length,
            data: purchaseOrders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching purchase orders',
            error: error.message
        });
    }
};

// Get single purchase order
exports.getPurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findById(req.params.id)
            .populate('supplier')
            .populate('createdBy', 'name email')
            .populate('approvedBy', 'name email');

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: purchaseOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching purchase order',
            error: error.message
        });
    }
};

// Create purchase order
exports.createPurchaseOrder = async (req, res) => {
    try {
        // Generate order number (you can customize this logic)
        const orderCount = await PurchaseOrder.countDocuments();
        const orderNumber = `PO-${Date.now()}-${orderCount + 1}`;

        const purchaseOrder = await PurchaseOrder.create({
            ...req.body,
            orderNumber,
            createdBy: req.user?._id // Assuming user is attached via auth middleware
        });

        res.status(201).json({
            success: true,
            message: 'Purchase order created successfully',
            data: purchaseOrder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating purchase order',
            error: error.message
        });
    }
};

// Update purchase order
exports.updatePurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Purchase order updated successfully',
            data: purchaseOrder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating purchase order',
            error: error.message
        });
    }
};

// Approve purchase order
exports.approvePurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
            req.params.id,
            {
                status: 'Approved',
                approvedBy: req.user?._id,
                approvalDate: new Date()
            },
            { new: true }
        );

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Purchase order approved successfully',
            data: purchaseOrder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error approving purchase order',
            error: error.message
        });
    }
};

// Delete purchase order
exports.deletePurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Purchase order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting purchase order',
            error: error.message
        });
    }
};
