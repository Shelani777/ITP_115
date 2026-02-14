const PDFDocument = require('pdfkit');

exports.generatePurchaseOrderPDF = (purchaseOrder) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      let buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text('PURCHASE ORDER', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`PO Number: ${purchaseOrder.poNumber}`);
      doc.text(`Date: ${new Date(purchaseOrder.orderDate).toLocaleDateString()}`);
      doc.moveDown();

      // Supplier Info
      doc.fontSize(14).text('Supplier Information');
      doc.fontSize(12).text(`Company: ${purchaseOrder.supplier.companyName}`);
      doc.text(`Contact: ${purchaseOrder.supplier.contactPerson?.name}`);
      doc.moveDown();

      // Items Table
      doc.fontSize(14).text('Items');
      doc.moveDown();

      let y = doc.y;
      doc.fontSize(10).text('Item', 50, y);
      doc.text('Qty', 300, y);
      doc.text('Unit Price', 400, y);
      doc.text('Total', 500, y);

      y += 20;
      purchaseOrder.items.forEach(item => {
        doc.text(item.partName, 50, y);
        doc.text(item.quantity.ordered.toString(), 300, y);
        doc.text(`Rs. ${item.unitPrice}`, 400, y);
        doc.text(`Rs. ${item.totalPrice}`, 500, y);
        y += 20;
      });

      // Totals
      y += 20;
      doc.fontSize(12).text(`Subtotal: Rs. ${purchaseOrder.subtotal}`, 400, y);
      y += 20;
      doc.text(`Tax: Rs. ${purchaseOrder.taxTotal}`, 400, y);
      y += 20;
      doc.text(`Grand Total: Rs. ${purchaseOrder.grandTotal}`, 400, y);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
