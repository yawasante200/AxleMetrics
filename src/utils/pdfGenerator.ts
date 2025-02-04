import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Result } from '../types/truckFactor';

export const generatePDF = async (data: Result[], formData: { company: string; address: string; phone: string; date: string; project: string; name: string; }): Promise<void> => {
  if (!data || data.length === 0) {
    alert('No data available to generate PDF.');
    return;
  }

  // Fetch the existing PDF template
  const templateBytes = await fetch('../ESAL Report.pdf').then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  firstPage.drawText(`${formData.company}`, { x: 92.54, y: 695.7, size: 11, color: rgb(0, 0, 0) });
  firstPage.drawText(`${formData.address}`, { x: 92.54, y: 680.5, size: 11, color: rgb(0, 0, 0) });
  firstPage.drawText(`${formData.phone}`, { x: 92.54, y: 664.7, size: 11, color: rgb(0, 0, 0) });
  firstPage.drawText(`${formData.date}`, { x: 52.54, y: 508.5, size: 10, color: rgb(0, 0, 0) });
  firstPage.drawText(`${formData.project}`, { x: 215.54, y: 509.5, size: 10, color: rgb(0, 0, 0) });
  firstPage.drawText(`${formData.name}`, { x: 422.54, y: 509.5, size: 10, color: rgb(0, 0, 0) });

  // Define table position and dimensions
  const xStart = 126.6; // Left margin in points (0.05")
  const yStart = 418.56; // Top margin in points (3.73")
  const rowHeight = 20; // Height of each row
  const colWidths = [180, 150]; // Width of "Axle Type" and "Average ESAL" columns
  const headers = ['Axle Type', 'Average ESAL']; // Updated headers

  // Draw table headers with borders
  let currentY = yStart;
  headers.forEach((header, index) => {
    const xPos = xStart + colWidths.slice(0, index).reduce((a, b) => a + b, 0);

    // Draw header text
    firstPage.drawText(header, {
      x: xPos + 5, // Padding inside the cell
      y: currentY - 15, // Center text vertically within the cell
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Draw header cell border
    firstPage.drawRectangle({
      x: xPos,
      y: currentY - rowHeight,
      width: colWidths[index],
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  });
  currentY -= rowHeight; // Move to the next row

  // Draw table rows with borders
  data.forEach((row) => {
    const rowData = [row.axleType, row.averageESAL.toFixed(4)];
    rowData.forEach((cell, index) => {
      const xPos = xStart + colWidths.slice(0, index).reduce((a, b) => a + b, 0);

      // Draw cell text
      firstPage.drawText(cell, {
        x: xPos + 5, // Padding inside the cell
        y: currentY - 15, // Center text vertically within the cell
        size: 10,
        color: rgb(0, 0, 0),
      });

      // Draw cell border
      firstPage.drawRectangle({
        x: xPos,
        y: currentY - rowHeight,
        width: colWidths[index],
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    });
    currentY -= rowHeight; // Move to the next row
  });

  // Serialize the PDF and trigger a download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'ESAL_Report.pdf');
};
