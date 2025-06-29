import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import downloadsFolder from 'downloads-folder'; // ✅ Add this

export default async function generateItemPDF(items) {
  const doc = new PDFDocument({ margin: 30 });
  const timestamp = new Date().toISOString().slice(0, 10);
  
  // ✅ Save to user's Downloads folder
  const filePath = path.resolve(downloadsFolder(), `item_status_${timestamp}.pdf`);
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.fontSize(16).text('Item Status Report', { align: 'center' }).moveDown();
  doc.fontSize(10);

  const tableTop = 80;
  const colWidths = [60, 120, 100, 50, 60];
  const colX = [
    30,
    30 + colWidths[0],
    30 + colWidths[0] + colWidths[1],
    30 + colWidths[0] + colWidths[1] + colWidths[2],
    30 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
  ];

  ['Code', 'Name', 'Category', 'Qty', 'Price'].forEach((text, i) => {
    doc.text(text, colX[i], tableTop, { bold: true });
  });

  let y = tableTop + 20;
  items.forEach(item => {
    doc.text(item.itemCode, colX[0], y);
    doc.text(item.itemName, colX[1], y);
    doc.text(item.category, colX[2], y);
    doc.text(item.quantity?.toString() || '-', colX[3], y);
    doc.text(item.price.toFixed(2), colX[4], y);
    y += 20;
    if (y > doc.page.height - 50) {
      doc.addPage();
      y = 50;
    }
  });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
  });
}
