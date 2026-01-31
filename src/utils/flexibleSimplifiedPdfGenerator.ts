
import { PDFDocument, rgb, PDFPage } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Result, CompanyDetails } from '../types/truckFactor';
import { ESALConfig } from '../types/config';

// Page layout constants
const PAGE_HEIGHT = 842; // A4 height in points
const TOP_MARGIN = 750;
const BOTTOM_MARGIN = 50;

// Function to draw table headers on a page
const drawTableHeaders = (
  page: PDFPage,
  headers: string[],
  xStart: number,
  currentY: number,
  colWidths: number[],
  rowHeight: number
) => {
  headers.forEach((header, index) => {
    const xPos = xStart + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
    page.drawText(header, { x: xPos + 5, y: currentY - 15, size: 12, color: rgb(0, 0, 0) });
    page.drawRectangle({
      x: xPos,
      y: currentY - rowHeight,
      width: colWidths[index],
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  });
};

export const generateFlexibleSimplifiedPDF = async (
  data: Result[],
  formData: CompanyDetails,
  config: ESALConfig
): Promise<void> => {
  if (!data || data.length === 0) {
    alert('No data available to generate PDF.');
    return;
  }

  const templatePath = '/Flexible Simplified AASHO ESAL Report.pdf';
  const response = await fetch(templatePath);
  if (!response.ok) {
    console.error('Failed to fetch PDF template:', response.status, response.statusText);
    alert(`Failed to load PDF: ${response.statusText}`);
    return;
  }

  const templateBytes = await response.arrayBuffer();
  if (templateBytes.byteLength === 0) {
    console.error("Fetched PDF file is empty");
    alert("Error: The PDF file is empty.");
    return;
  }

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  let currentPage = pages[0];

  // Company details
  currentPage.drawText(formData.company || '', { x: 102.54, y: 695.51, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(formData.address || '', { x: 98.70, y: 680.91, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(formData.phone || '', { x: 82.62, y: 665.31, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(formData.date || '', { x: 60.97, y: 501.29, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(formData.project || '', { x: 224.82, y: 501.29, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(formData.name || '', { x: 429.80, y: 501.29, size: 10, color: rgb(0, 0, 0) });

  // Configuration values
  currentPage.drawText(`${config.standardAxleLoads}${config.unit}`, {
    x: 226.6,
    y: 405,
    size: 10,
    color: rgb(0, 0, 0),
  });
  currentPage.drawText(`${config.loadEquivalencyExponent}`, {
    x: 406.6,
    y: 405,
    size: 10,
    color: rgb(0, 0, 0),
  });

  // Table
  const xStart = 126.6;
  const yStart = 368.56;
  const rowHeight = 20;
  const colWidths = [180, 150];
  const headers = ['Axle Type', 'Average ESAL'];
  let currentY = yStart;

  // Draw headers on first page
  drawTableHeaders(currentPage, headers, xStart, currentY, colWidths, rowHeight);
  currentY -= rowHeight;

  // Draw data rows with page break handling
  for (const row of data) {
    // Check if we need a new page
    if (currentY - rowHeight < BOTTOM_MARGIN) {
      currentPage = pdfDoc.addPage([595, PAGE_HEIGHT]);
      currentY = TOP_MARGIN;
      // Draw headers on new page
      drawTableHeaders(currentPage, headers, xStart, currentY, colWidths, rowHeight);
      currentY -= rowHeight;
    }

    const rowData = [row.axleType, row.averageESAL.toFixed(4)];
    rowData.forEach((cell, index) => {
      const xPos = xStart + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
      currentPage.drawText(cell, { x: xPos + 5, y: currentY - 15, size: 10, color: rgb(0, 0, 0) });
      currentPage.drawRectangle({
        x: xPos,
        y: currentY - rowHeight,
        width: colWidths[index],
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    });
    currentY -= rowHeight;
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  saveAs(blob, 'Flexible_Simplified_AASHO_ESAL_Report.pdf');
};
