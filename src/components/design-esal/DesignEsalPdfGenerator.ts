import { PDFDocument, rgb, PDFPage } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues } from './types';
import { CompanyDetails } from '../../types/truckFactor';

interface GeneratePDFProps {
  vehicleData: VehicleEsalData[];
  formValues: FormValues;
  totalDesignEsals: number;
  growthRateType: string;
  companyDetails?: CompanyDetails;
}

// Page layout constants
const PAGE_HEIGHT = 842; // A4 height in points
const TOP_MARGIN = 750;
const BOTTOM_MARGIN = 50;

// Function to wrap text within a given width
const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  // Approximate character width (this is a rough estimate for Arial/Helvetica)
  const charWidth = fontSize * 0.6;
  const maxCharsPerLine = Math.floor(maxWidth / charWidth);

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word is too long, break it
        lines.push(word);
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

// Function to draw multi-line text
const drawMultiLineText = (
  page: PDFPage,
  lines: string[],
  x: number,
  y: number,
  fontSize: number,
  lineHeight: number = fontSize * 1.2
) => {
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: x,
      y: y - (index * lineHeight),
      size: fontSize,
      color: rgb(0, 0, 0)
    });
  });
};

// Function to draw table headers on a page
const drawTableHeaders = (
  page: PDFPage,
  headers: string[],
  wrappedHeaders: string[][],
  xStart: number,
  currentY: number,
  colWidths: number[],
  headerRowHeight: number,
  fontSize: number,
  lineHeight: number
) => {
  // Draw header rectangles first
  headers.forEach((_, index) => {
    const xPos = xStart + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
    page.drawRectangle({
      x: xPos,
      y: currentY - headerRowHeight,
      width: colWidths[index],
      height: headerRowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  });

  // Draw wrapped header text
  wrappedHeaders.forEach((lines, index) => {
    const xPos = xStart + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
    const textStartY = currentY - 8; // Start from top with padding
    drawMultiLineText(page, lines, xPos + 2, textStartY, fontSize, lineHeight);
  });
};

export const generateDesignEsalPDF = async ({
  vehicleData,
  formValues,
  totalDesignEsals: _totalDesignEsals,
  growthRateType: _growthRateType,
  companyDetails
}: GeneratePDFProps): Promise<void> => {

  if (!vehicleData || vehicleData.length === 0) {
    alert('No data available to generate PDF.');
    return;
  }

  // Provide default company details if not provided
  const defaultCompanyDetails: CompanyDetails = {
    company: '',
    address: '',
    phone: '',
    date: new Date().toLocaleDateString(),
    project: '',
    name: ''
  };

  const safeCompanyDetails = companyDetails || defaultCompanyDetails;

  const templatePath = '/Design ESAL Report.pdf';
  const response = await fetch(templatePath);
  if (!response.ok) {
    console.error('Failed to fetch PDF template:', response.status, response.statusText);
    alert(`Failed to load PDF template: ${response.statusText}`);
    return;
  }

  const templateBytes = await response.arrayBuffer();
  if (templateBytes.byteLength === 0) {
    console.error("Fetched PDF file is empty");
    alert("Error: The PDF template file is empty.");
    return;
  }

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  let currentPage = pages[0];
  const currentYear = new Date().getFullYear();
  const designYear = currentYear + formValues.designPeriod;

  // Company details - using similar positioning to TruckFactor templates
  currentPage.drawText(safeCompanyDetails.company || '', { x: 102.54, y: 695.51, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(safeCompanyDetails.address || '', { x: 98.70, y: 680.91, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(safeCompanyDetails.phone || '', { x: 82.62, y: 665.31, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(safeCompanyDetails.date || '', { x: 60.97, y: 501.29, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(safeCompanyDetails.project || '', { x: 224.82, y: 501.29, size: 10, color: rgb(0, 0, 0) });
  currentPage.drawText(safeCompanyDetails.name || '', { x: 429.80, y: 501.29, size: 10, color: rgb(0, 0, 0) });

  // Table positioning - optimized for A4 portrait
  const xStart = 30; // Start closer to left margin
  const yStart = 400;
  const baseRowHeight = 20;
  const fontSize = 7;
  const lineHeight = fontSize * 1.2;

  // Optimized column widths for A4 portrait (total: ~480 points)
  const colWidths = [55, 55, 55, 55, 60, 65, 75, 60, 75];
  const headers = [
    'Vehicle Class',
    `${designYear} Two-Way AADT`,
    `${designYear} One-Way AADT`,
    `${designYear} Design Lane AADT`,
    'Traffic Growth Rate',
    'Traffic Growth Factor',
    `${formValues.designPeriod}-Year Design Lane Cumulative Traffic`,
    'ESAL Factor',
    `${formValues.designPeriod}-Year ESALs`
  ];

  // Wrap headers and calculate required height
  const wrappedHeaders = headers.map((header, index) =>
    wrapText(header, colWidths[index] - 4, fontSize) // -4 for padding
  );

  // Find the maximum number of lines in any header to determine row height
  const maxLines = Math.max(...wrappedHeaders.map(lines => lines.length));
  const headerRowHeight = Math.max(baseRowHeight, maxLines * lineHeight + 8); // +8 for padding

  let currentY = yStart;

  // Draw headers on first page
  drawTableHeaders(currentPage, headers, wrappedHeaders, xStart, currentY, colWidths, headerRowHeight, fontSize, lineHeight);
  currentY -= headerRowHeight;

  // Calculate the sum of individual vehicle ESALs for verification
  const calculatedTotalEsals = vehicleData.reduce((sum, vehicle) => sum + vehicle.designEsals, 0);

  // Draw data rows with page break handling
  for (const vehicle of vehicleData) {
    // Check if we need a new page (if current row would go below bottom margin)
    if (currentY - baseRowHeight < BOTTOM_MARGIN) {
      // Add a new page
      currentPage = pdfDoc.addPage([595, PAGE_HEIGHT]); // A4 size
      currentY = TOP_MARGIN;

      // Draw headers on new page for context
      drawTableHeaders(currentPage, headers, wrappedHeaders, xStart, currentY, colWidths, headerRowHeight, fontSize, lineHeight);
      currentY -= headerRowHeight;
    }

    const rowData = [
      vehicle.vehicleClass,
      Math.round(vehicle.aadt).toLocaleString(),
      Math.round(vehicle.directionalAadt).toLocaleString(),
      Math.round(vehicle.designLaneAadt).toLocaleString(),
      Array.isArray(vehicle.growthRate) ? 'Variable' : vehicle.growthRate.toFixed(1),
      vehicle.growthFactor.toFixed(2),
      Math.round(vehicle.yearlyTraffic).toLocaleString(),
      vehicle.truckFactor.toFixed(4),
      Math.round(vehicle.designEsals).toLocaleString()
    ];

    rowData.forEach((cell, index) => {
      const xPos = xStart + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
      currentPage.drawText(cell, { x: xPos + 2, y: currentY - 15, size: fontSize, color: rgb(0, 0, 0) });
      currentPage.drawRectangle({
        x: xPos,
        y: currentY - baseRowHeight,
        width: colWidths[index],
        height: baseRowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    });
    currentY -= baseRowHeight;
  }

  // Check if we need a new page for the total row
  if (currentY - baseRowHeight < BOTTOM_MARGIN) {
    currentPage = pdfDoc.addPage([595, PAGE_HEIGHT]);
    currentY = TOP_MARGIN;
    drawTableHeaders(currentPage, headers, wrappedHeaders, xStart, currentY, colWidths, headerRowHeight, fontSize, lineHeight);
    currentY -= headerRowHeight;
  }

  // Draw total row
  const totalRowData = [
    'Total',
    formValues.aadt.toLocaleString(),
    Math.round(formValues.aadt * formValues.directionDistribution / 100).toLocaleString(),
    Math.round(formValues.aadt * formValues.directionDistribution / 100 * formValues.laneDistribution / 100).toLocaleString(),
    '',
    '',
    '',
    '',
    Math.round(calculatedTotalEsals).toLocaleString()
  ];

  totalRowData.forEach((cell, index) => {
    const xPos = xStart + colWidths.slice(0, index).reduce((a, b) => a + b, 0);

    // Grey background
    currentPage.drawRectangle({
      x: xPos,
      y: currentY - baseRowHeight,
      width: colWidths[index],
      height: baseRowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
      color: rgb(0.9, 0.9, 0.9)
    });

    // Cell text
    currentPage.drawText(cell, {
      x: xPos + 2,
      y: currentY - 15,
      size: fontSize,
      color: rgb(0, 0, 0)
    });
  });

  // Move down for summary label
  currentY -= baseRowHeight + 20;

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  saveAs(blob, `Design_ESAL_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};