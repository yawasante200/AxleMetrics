import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues, ReportMetadata, ESALRoundingOption } from './types';
import { CompanyDetails } from '../../types/truckFactor';
import { formatGrowthRate, calculateYearlyESALData, roundESAL, validateAADTPercentages } from './utils';
import YearlyESALChart from '../charts/YearlyESALChart';
import { VehicleClassificationTable } from '../VehicleIllustrations';

interface GeneratePDFProps {
  vehicleData: VehicleEsalData[];
  formValues: FormValues;
  totalDesignEsals: number;
  growthRateType: string;
  companyDetails?: CompanyDetails;
  reportMetadata?: ReportMetadata;
  esalRoundingOption?: ESALRoundingOption;
}

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

// Colors matching the branding
const COLORS = {
  primary: [31, 41, 55] as [number, number, number],      // gray-800
  secondary: [107, 114, 128] as [number, number, number], // gray-500
  accent: [59, 130, 246] as [number, number, number],     // blue-500
  light: [249, 250, 251] as [number, number, number],     // gray-50
  white: [255, 255, 255] as [number, number, number],
  border: [209, 213, 219] as [number, number, number],    // gray-300
};

// Helper to add logo
const addLogo = async (pdf: jsPDF, x: number, y: number, height: number): Promise<void> => {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/Axle-logo.png';

    await new Promise<void>((resolve) => {
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const width = height * aspectRatio;
        pdf.addImage(img, 'PNG', x, y, width, height);
        resolve();
      };
      img.onerror = () => resolve();
      setTimeout(() => resolve(), 2000);
    });
  } catch {
    // If logo fails, continue without it
  }
};

// Helper to add header with logo and date
const addHeader = async (pdf: jsPDF, date: string, pageWidth: number): Promise<number> => {
  const margin = 20;
  let y = 15;

  // Add logo
  await addLogo(pdf, margin, y, 12);

  // Add date on right
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.secondary);
  pdf.text('Report Date', pageWidth - margin, y + 3, { align: 'right' });
  pdf.setFontSize(11);
  pdf.setTextColor(...COLORS.primary);
  pdf.text(date, pageWidth - margin, y + 9, { align: 'right' });

  // Add header line
  y += 18;
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(1);
  pdf.line(margin, y, pageWidth - margin, y);

  return y + 8;
};

// Helper to add footer
const addFooter = (pdf: jsPDF, pageWidth: number, pageHeight: number): void => {
  const margin = 20;
  const y = pageHeight - 15;

  pdf.setDrawColor(...COLORS.border);
  pdf.setLineWidth(0.3);
  pdf.line(margin, y - 5, pageWidth - margin, y - 5);

  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.secondary);
  pdf.text('© 2026 AxleMetrics - Professional Pavement Analysis Solutions', pageWidth / 2, y, { align: 'center' });
  pdf.text('This report is generated based on AASHTO methods', pageWidth / 2, y + 4, { align: 'center' });
};

export const generateDesignEsalPDF = async ({
  vehicleData,
  formValues,
  totalDesignEsals,
  growthRateType: _growthRateType,
  companyDetails,
  reportMetadata,
  esalRoundingOption = ESALRoundingOption.NEAREST_1000
}: GeneratePDFProps): Promise<void> => {
  if (!vehicleData || vehicleData.length === 0) {
    alert('No data available to generate PDF.');
    return;
  }

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    const baseYear = formValues.baseYear || new Date().getFullYear();
    const designYear = baseYear + formValues.designPeriod;
    const roundedTotalEsals = roundESAL(totalDesignEsals, esalRoundingOption);
    const yearlyESALData = calculateYearlyESALData(vehicleData, formValues);
    const aadtValidation = validateAADTPercentages(vehicleData.map(v => v.percentOfAadt));

    const safeCompanyDetails = companyDetails || {
      company: '',
      address: '',
      phone: '',
      date: new Date().toLocaleDateString(),
      project: '',
      name: ''
    };

    // ========== PAGE 1: Header, Info, and Vehicle Table ==========
    let y = await addHeader(pdf, safeCompanyDetails.date, pageWidth);

    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(...COLORS.primary);
    pdf.text('HIGHWAY PAVEMENT DESIGN REPORT', pageWidth / 2, y, { align: 'center' });
    y += 7;
    pdf.setFontSize(12);
    pdf.setTextColor(...COLORS.secondary);
    pdf.text(`${formValues.designPeriod}-Year Design ESAL Analysis`, pageWidth / 2, y, { align: 'center' });
    y += 10;

    // AADT Warning if invalid
    if (!aadtValidation.isValid) {
      pdf.setFillColor(254, 243, 199); // yellow-100
      pdf.setDrawColor(251, 191, 36); // yellow-400
      pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, 'FD');
      pdf.setFontSize(9);
      pdf.setTextColor(146, 64, 14); // yellow-800
      pdf.text(`⚠ Warning: ${aadtValidation.message}`, margin + 3, y + 6);
      y += 14;
    }

    // Project Information (if available)
    if (reportMetadata) {
      pdf.setFillColor(239, 246, 255); // blue-50
      pdf.setDrawColor(...COLORS.accent);
      pdf.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

      pdf.setFontSize(8);
      pdf.setTextColor(...COLORS.primary);
      pdf.text('PROJECT INFORMATION', margin + 3, y + 5);

      pdf.setFontSize(9);
      const colWidth = contentWidth / 3;
      pdf.setTextColor(...COLORS.secondary);
      pdf.text('Location', margin + 3, y + 10);
      pdf.text('Length', margin + colWidth + 3, y + 10);
      pdf.text('Analyst', margin + colWidth * 2 + 3, y + 10);

      pdf.setTextColor(...COLORS.primary);
      pdf.text(reportMetadata.projectLocation || 'N/A', margin + 3, y + 15);
      pdf.text(reportMetadata.projectLength ? `${reportMetadata.projectLength} ${reportMetadata.projectLengthUnit}` : 'N/A', margin + colWidth + 3, y + 15);
      pdf.text(reportMetadata.analystName || 'N/A', margin + colWidth * 2 + 3, y + 15);

      y += 22;
    }

    // Company Info and Project Summary (side by side)
    const boxWidth = (contentWidth - 4) / 2;

    // Company Info Box
    pdf.setFillColor(...COLORS.light);
    pdf.setDrawColor(...COLORS.border);
    pdf.roundedRect(margin, y, boxWidth, 22, 2, 2, 'FD');
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.primary);
    pdf.text('COMPANY INFORMATION', margin + 3, y + 5);
    pdf.setFontSize(9);
    pdf.setTextColor(...COLORS.secondary);
    pdf.text('Company', margin + 3, y + 11);
    pdf.text('Phone', margin + 3, y + 17);
    pdf.setTextColor(...COLORS.primary);
    pdf.text(safeCompanyDetails.company || 'N/A', margin + 25, y + 11);
    pdf.text(safeCompanyDetails.phone || 'N/A', margin + 25, y + 17);

    // Project Summary Box
    pdf.setFillColor(...COLORS.light);
    pdf.roundedRect(margin + boxWidth + 4, y, boxWidth, 22, 2, 2, 'FD');
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.primary);
    pdf.text('PROJECT SUMMARY', margin + boxWidth + 7, y + 5);
    pdf.setFontSize(9);
    pdf.setTextColor(...COLORS.secondary);
    pdf.text('Project', margin + boxWidth + 7, y + 11);
    pdf.text('Prepared By', margin + boxWidth + 7, y + 17);
    pdf.setTextColor(...COLORS.primary);
    pdf.text(safeCompanyDetails.project || 'N/A', margin + boxWidth + 35, y + 11);
    pdf.text(safeCompanyDetails.name || 'N/A', margin + boxWidth + 35, y + 17);

    y += 26;

    // Design Parameters Box
    pdf.setFillColor(...COLORS.light);
    pdf.setDrawColor(...COLORS.border);
    pdf.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.primary);
    pdf.text('DESIGN PARAMETERS', margin + 3, y + 5);

    const paramColWidth = contentWidth / 4;
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.secondary);
    pdf.text('Base Year AADT', margin + 3, y + 11);
    pdf.text('Design Period', margin + paramColWidth + 3, y + 11);
    pdf.text('Base Year', margin + paramColWidth * 2 + 3, y + 11);
    pdf.text('Design Year', margin + paramColWidth * 3 + 3, y + 11);

    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.primary);
    pdf.text(formValues.aadt.toLocaleString(), margin + 3, y + 16);
    pdf.text(`${formValues.designPeriod} years`, margin + paramColWidth + 3, y + 16);
    pdf.text(baseYear.toString(), margin + paramColWidth * 2 + 3, y + 16);
    pdf.text(designYear.toString(), margin + paramColWidth * 3 + 3, y + 16);

    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.secondary);
    pdf.text('Direction Distribution', margin + 3, y + 21);
    pdf.text('Lane Distribution', margin + paramColWidth + 3, y + 21);
    pdf.setTextColor(...COLORS.primary);
    pdf.text(`${formValues.directionDistribution}%`, margin + 45, y + 21);
    pdf.text(`${formValues.laneDistribution}%`, margin + paramColWidth + 40, y + 21);

    y += 28;

    // Vehicle Data Table Title
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.primary);
    pdf.text('CALCULATED RESULTS', margin, y);
    y += 4;

    // Vehicle Data Table using autoTable
    const vehicleTableData = vehicleData.map(v => [
      v.vehicleClass,
      Math.round(v.aadt).toLocaleString(),
      Math.round(v.directionalAadt).toLocaleString(),
      Math.round(v.designLaneAadt).toLocaleString(),
      formatGrowthRate(v.growthRate),
      v.growthFactor.toFixed(2),
      v.truckFactor.toFixed(4),
      Math.round(v.designEsals).toLocaleString()
    ]);

    autoTable(pdf, {
      startY: y,
      head: [['Vehicle Class', `${baseYear} AADT`, 'Dir. AADT', 'Lane AADT', 'Growth Rate', 'Growth Factor', 'Truck Factor', 'Design ESALs']],
      body: vehicleTableData,
      foot: [[
        { content: `Total ${formValues.designPeriod}-Year Design ESALs:`, colSpan: 7, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: roundedTotalEsals.toLocaleString(), styles: { halign: 'right', fontStyle: 'bold' } }
      ]],
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: 'bold',
        halign: 'center',
      },
      footStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
      },
      alternateRowStyles: {
        fillColor: COLORS.light,
      },
      columnStyles: {
        0: { cellWidth: 35 },
        7: { halign: 'right', fontStyle: 'bold' },
      },
      margin: { left: margin, right: margin },
      didDrawPage: () => {
        addFooter(pdf, pageWidth, pageHeight);
      },
    });

    // ========== PAGE 2: ESAL Chart and Yearly Table ==========
    pdf.addPage();
    y = await addHeader(pdf, safeCompanyDetails.date, pageWidth);

    // Section Title
    pdf.setFontSize(14);
    pdf.setTextColor(...COLORS.primary);
    pdf.text('ESAL ANALYSIS', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Render Chart using html2canvas (only element that needs it)
    const chartContainer = document.createElement('div');
    chartContainer.style.position = 'absolute';
    chartContainer.style.left = '-9999px';
    chartContainer.style.width = '600px';
    chartContainer.style.backgroundColor = '#ffffff';
    document.body.appendChild(chartContainer);

    const chartRoot = createRoot(chartContainer);
    await new Promise<void>((resolve) => {
      chartRoot.render(
        React.createElement(YearlyESALChart, {
          data: yearlyESALData,
          title: `Yearly Design ESAL vs Year (${baseYear} - ${designYear})`,
        })
      );
      setTimeout(resolve, 500);
    });

    const chartCanvas = await html2canvas(chartContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const chartImgData = chartCanvas.toDataURL('image/png');
    const chartWidth = contentWidth;
    const chartHeight = (chartCanvas.height * chartWidth) / chartCanvas.width;

    pdf.addImage(chartImgData, 'PNG', margin, y, chartWidth, Math.min(chartHeight, 80));
    y += Math.min(chartHeight, 80) + 10;

    chartRoot.unmount();
    document.body.removeChild(chartContainer);

    // Yearly ESAL Breakdown Title
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.primary);
    pdf.text('YEARLY ESAL BREAKDOWN', margin, y);
    y += 4;

    // Yearly ESAL Table using autoTable (auto-paginates!)
    const yearlyTableData = yearlyESALData.map(d => [
      d.year.toString(),
      d.yearlyESAL.toLocaleString(),
      d.cumulativeESAL.toLocaleString()
    ]);

    autoTable(pdf, {
      startY: y,
      head: [['Year', 'Yearly ESAL', 'Cumulative ESAL']],
      body: yearlyTableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: COLORS.light,
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'right' },
        2: { halign: 'right' },
      },
      margin: { left: margin, right: margin },
      didDrawPage: (data) => {
        // Add header on new pages
        if (data.pageNumber > 1) {
          pdf.setFontSize(10);
          pdf.setTextColor(...COLORS.primary);
          pdf.text('YEARLY ESAL BREAKDOWN (Continued)', margin, 20);
        }
        addFooter(pdf, pageWidth, pageHeight);
      },
    });

    // ========== FINAL PAGE: Vehicle Classification Reference ==========
    pdf.addPage();
    y = await addHeader(pdf, safeCompanyDetails.date, pageWidth);

    pdf.setFontSize(14);
    pdf.setTextColor(...COLORS.primary);
    pdf.text('VEHICLE CLASSIFICATION REFERENCE', pageWidth / 2, y, { align: 'center' });
    y += 8;

    // Render VehicleClassificationTable component using html2canvas
    const vehicleContainer = document.createElement('div');
    vehicleContainer.style.position = 'absolute';
    vehicleContainer.style.left = '-9999px';
    vehicleContainer.style.width = '600px';
    vehicleContainer.style.backgroundColor = '#ffffff';
    vehicleContainer.style.padding = '10px';
    document.body.appendChild(vehicleContainer);

    const vehicleRoot = createRoot(vehicleContainer);
    await new Promise<void>((resolve) => {
      vehicleRoot.render(
        React.createElement(VehicleClassificationTable)
      );
      setTimeout(resolve, 500);
    });

    const vehicleCanvas = await html2canvas(vehicleContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const vehicleImgData = vehicleCanvas.toDataURL('image/png');
    const vehicleImgWidth = contentWidth;
    const vehicleImgHeight = (vehicleCanvas.height * vehicleImgWidth) / vehicleCanvas.width;

    // If the vehicle table is too tall, we need to slice it across multiple pages
    const availableHeight = pageHeight - y - 25; // Leave room for footer

    if (vehicleImgHeight <= availableHeight) {
      // Fits on one page
      pdf.addImage(vehicleImgData, 'PNG', margin, y, vehicleImgWidth, vehicleImgHeight);
    } else {
      // Need to slice across multiple pages
      let yOffset = 0;
      let isFirstSlice = true;

      while (yOffset < vehicleImgHeight) {
        if (!isFirstSlice) {
          pdf.addPage();
          y = await addHeader(pdf, safeCompanyDetails.date, pageWidth);
          pdf.setFontSize(10);
          pdf.setTextColor(...COLORS.primary);
          pdf.text('VEHICLE CLASSIFICATION REFERENCE (Continued)', margin, y);
          y += 5;
        }

        const sliceHeight = Math.min(availableHeight, vehicleImgHeight - yOffset);
        const sourceY = (yOffset / vehicleImgHeight) * vehicleCanvas.height;
        const sourceHeight = (sliceHeight / vehicleImgHeight) * vehicleCanvas.height;

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = vehicleCanvas.width;
        sliceCanvas.height = sourceHeight;

        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            vehicleCanvas,
            0, sourceY, vehicleCanvas.width, sourceHeight,
            0, 0, sliceCanvas.width, sliceCanvas.height
          );

          const sliceImgData = sliceCanvas.toDataURL('image/png');
          pdf.addImage(sliceImgData, 'PNG', margin, y, vehicleImgWidth, sliceHeight);
        }

        addFooter(pdf, pageWidth, pageHeight);
        yOffset += sliceHeight;
        isFirstSlice = false;
      }
    }

    vehicleRoot.unmount();
    document.body.removeChild(vehicleContainer);

    addFooter(pdf, pageWidth, pageHeight);

    // Save PDF
    const filename = `Highway-Pavement-Design-Report_${formValues.designPeriod}-Year_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert('Failed to generate PDF: ' + errorMessage);
  }
};