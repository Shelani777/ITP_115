const mongoose = require('mongoose');

const goodsReceiptSchema = new mongoose.Schema({
    receiptNumber: {
        type: String,
        required: true,
        unique: true
    },
    purchaseOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder',
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    receiptDate: {
        type: Date,
        default: Date.now
    },
    items: [{
        itemName: {
            type: String,
            required: true
        },
        orderedQuantity: {
            type: Number,
            required: true
        },
        receivedQuantity: {
            type: Number,
            required: true
        },
        condition: {
            type: String,
            enum: ['Good', 'Damaged', 'Partial'],
            default: 'Good'
        },
        notes: String
    }],
    status: {
        type: String,
        enum: ['Complete', 'Partial', 'Damaged'],
        default: 'Complete'
    },
    receivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('GoodsReceipt', goodsReceiptSchema);
