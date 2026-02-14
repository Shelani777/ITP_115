// Supplier routes will be defined here
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

const {
  createPurchaseOrder,
  getPurchaseOrders,
  submitForApproval,
  approvePurchaseOrder
} = require('../controllers/purchaseOrderController');

const {
  createGoodsReceipt,
  getGoodsReceipts
} = require('../controllers/goodsReceiptController');

const {
  createSupplierInvoice,
  getSupplierInvoices,
  updatePaymentStatus
} = require('../controllers/supplierInvoiceController');

// Supplier routes
router.route('/')
  .get(protect, getSuppliers)
  .post(protect, authorize('admin'), createSupplier);

router.route('/:id')
  .get(protect, getSupplier)
  .put(protect, authorize('admin'), updateSupplier)
  .delete(protect, authorize('admin'), deleteSupplier);

// Purchase Order routes
router.route('/purchase-orders')
  .get(protect, getPurchaseOrders)
  .post(protect, createPurchaseOrder);

router.route('/purchase-orders/:id/submit')
  .put(protect, submitForApproval);

router.route('/purchase-orders/:id/approve')
  .put(protect, authorize('admin'), approvePurchaseOrder);

// Goods Receipt routes
router.route('/goods-receipt')
  .get(protect, getGoodsReceipts)
  .post(protect, createGoodsReceipt);

// Invoice routes
router.route('/invoices')
  .get(protect, getSupplierInvoices)
  .post(protect, createSupplierInvoice);

router.route('/invoices/:id/payment')
  .put(protect, authorize('admin'), updatePaymentStatus);

module.exports = router;
