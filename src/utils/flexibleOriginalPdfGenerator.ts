import React from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Result, CompanyDetails } from '../types/truckFactor'
import { ESALConfig } from '../types/config'
import { ReportMetadata } from '../components/design-esal/types'
import { createRoot } from 'react-dom/client'
import PDFTemplate from '../components/PDFTemplate'

export const generateFlexibleOriginalPDF = async (
  data: Result[],
  formData: CompanyDetails,
  config: ESALConfig,
  reportMetadata?: ReportMetadata,
  aadtTotalPercentage?: number
): Promise<void> => {
  if (!data || data.length === 0) {
    alert('No data available to generate PDF.')
    return
  }

  try {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.width = '210mm'
    document.body.appendChild(container)

    const root = createRoot(container)

    // Pagination Logic
    const resultsChunks: Result[][] = [];
    const remainingResults = [...data];

    // Page 1 Estimate: Heavy Metadata
    // Header(50) + Title(25) + Warning(25) + Meta(40) + Company(45) + Params(40) + TableHeader(15) + Footer(20) = ~260mm
    // Available: 297 - 45 (margins) - 260 = ~negative or close to 0.
    // Let's assume Page 1 can only hold maybe 1-2 rows or just metadata.
    // Safe bet: Max 3 items if no warning/metadata, 0-1 if full.
    // Let's use a dynamic estimate or just conservative 1 item.
    const ITEMS_PER_PAGE_1 = 3;
    const ITEMS_PER_PAGE_N = 16; // (297-40-85)/10 = ~17

    if (remainingResults.length > 0) {
      resultsChunks.push(remainingResults.splice(0, ITEMS_PER_PAGE_1));
    }
    while (remainingResults.length > 0) {
      resultsChunks.push(remainingResults.splice(0, ITEMS_PER_PAGE_N));
    }

    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(PDFTemplate, {
          formData: formData,
          results: data,
          config: config,
          pavementType: 'flexible',
          esalType: 'AASHTO',
          reportMetadata: reportMetadata,
          aadtTotalPercentage: aadtTotalPercentage,
          resultsChunks
        })
      )
      setTimeout(resolve, 800)
    })

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()

    await new Promise(resolve => setTimeout(resolve, 200))

    // Capture Report Pages
    const pageElements = container.querySelectorAll('.pdf-content-page');

    for (let i = 0; i < pageElements.length; i++) {
      if (i > 0) pdf.addPage();

      const canvas = await html2canvas(pageElements[i] as HTMLElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
    }

    // Capture vehicles (always separate)
    const vehiclesElement = container.querySelector('#pdf-vehicles') as HTMLElement
    if (vehiclesElement) {
      // Detect if vehicle page is landscape
      const isLandscape = vehiclesElement.getAttribute('data-orientation') === 'landscape';

      const canvas = await html2canvas(vehiclesElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: isLandscape ? 1123 : 794
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.85)
      const pdfWidth = isLandscape ? 297 : pageWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      // Add new page with appropriate orientation
      pdf.addPage('a4', isLandscape ? 'landscape' : 'portrait')
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight)
    }

    const filename =
      'Flexible-AASHTO-Highway-Design-Report_' +
      new Date().toISOString().split('T')[0] +
      '.pdf'

    pdf.save(filename)

    root.unmount()
    document.body.removeChild(container)
  } catch (error) {
    console.error('PDF Generation Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to generate PDF: ' + errorMessage)
  }
}