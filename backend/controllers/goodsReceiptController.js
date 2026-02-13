const GoodsReceipt = require('../models/GoodsReceipt');
const PurchaseOrder = require('../models/PurchaseOrder');

// Get all goods receipts
exports.getAllGoodsReceipts = async (req, res) => {
    try {
        const goodsReceipts = await GoodsReceipt.find()
            .populate('purchaseOrder')
            .populate('supplier', 'name email')
            .populate('receivedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: goodsReceipts.length,
            data: goodsReceipts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching goods receipts',
            error: error.message
        });
    }
};

// Get single goods receipt
exports.getGoodsReceipt = async (req, res) => {
    try {
        const goodsReceipt = await GoodsReceipt.findById(req.params.id)
            .populate('purchaseOrder')
            .populate('supplier')
            .populate('receivedBy', 'name email');

        if (!goodsReceipt) {
            return res.status(404).json({
                success: false,
                message: 'Goods receipt not found'
            });
        }

        res.status(200).json({
            success: true,
            data: goodsReceipt
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching goods receipt',
            error: error.message
        });
    }
};

// Create goods receipt
exports.createGoodsReceipt = async (req, res) => {
    try {
        // Generate receipt number
        const receiptCount = await GoodsReceipt.countDocuments();
        const receiptNumber = `GR-${Date.now()}-${receiptCount + 1}`;

        const goodsReceipt = await GoodsReceipt.create({
            ...req.body,
            receiptNumber,
            receivedBy: req.user?._id
        });

        // Update purchase order status
        const purchaseOrder = await PurchaseOrder.findById(req.body.purchaseOrder);
        if (purchaseOrder) {
            // Check if all items are received
            const allReceived = req.body.items.every(
                item => item.receivedQuantity >= item.orderedQuantity
            );

            purchaseOrder.status = allReceived ? 'Received' : 'Partially Received';
            await purchaseOrder.save();
        }

        res.status(201).json({
            success: true,
            message: 'Goods receipt created successfully',
            data: goodsReceipt
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating goods receipt',
            error: error.message
        });
    }
};

// Update goods receipt
exports.updateGoodsReceipt = async (req, res) => {
    try {
        const goodsReceipt = await GoodsReceipt.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!goodsReceipt) {
            return res.status(404).json({
                success: false,
                message: 'Goods receipt not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Goods receipt updated successfully',
            data: goodsReceipt
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating goods receipt',
            error: error.message
        });
    }
};

// Delete goods receipt
exports.deleteGoodsReceipt = async (req, res) => {
    try {
        const goodsReceipt = await GoodsReceipt.findByIdAndDelete(req.params.id);

        if (!goodsReceipt) {
            return res.status(404).json({
                success: false,
                message: 'Goods receipt not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Goods receipt deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting goods receipt',
            error: error.message
        });
    }
};
