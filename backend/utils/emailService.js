const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendPOEmail = async (to, purchaseOrder, pdfBuffer) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Purchase Order ${purchaseOrder.poNumber}`,
      html: `
        <h2>Purchase Order ${purchaseOrder.poNumber}</h2>
        <p>Dear Supplier,</p>
        <p>Please find attached purchase order ${purchaseOrder.poNumber}.</p>
        <p>Order Date: ${new Date(purchaseOrder.orderDate).toLocaleDateString()}</p>
        <p>Total Amount: Rs. ${purchaseOrder.grandTotal}</p>
        <br>
        <p>Thank you for your business!</p>
      `,
      attachments: [{
        filename: `PO-${purchaseOrder.poNumber}.pdf`,
        content: pdfBuffer
      }]
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};
