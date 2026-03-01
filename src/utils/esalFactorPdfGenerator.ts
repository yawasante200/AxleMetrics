import jsPDF from 'jspdf'
import React from 'react'
import { createRoot } from 'react-dom/client'
import html2canvas from 'html2canvas'
import { Result, CompanyDetails } from '../types/truckFactor'
import { ESALConfig } from '../types/config'
import ESALFactorReportTemplate from '../components/report/ESALFactorReportTemplate'

/**
 * Unified ESAL Factor PDF generator using html2canvas + React Template.
 * Each logical page is rendered as a separate A4-sized div and captured
 * individually, ensuring clean page breaks with no content splitting.
 */
export const generateEsalFactorPDF = async (
  data: Result[],
  formData: CompanyDetails,
  config: ESALConfig,
  pavementType: 'flexible' | 'rigid',
  esalType: 'simplified' | 'AASHTO'
): Promise<void> => {
  if (!data || data.length === 0) {
    alert('No data available to generate PDF.')
    return
  }

  // Create a hidden container for rendering the template
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '0'
  // Don't constrain width on the wrapper — each page div inside handles its own size
  document.body.appendChild(container)

  try {
    const root = createRoot(container)
    
    // Render the React template (which outputs multiple page divs)
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(ESALFactorReportTemplate, {
          data,
          formData,
          config,
          pavementType,
          esalType
        })
      )
      // Allow time for styles, images (logo, icons) to load
      setTimeout(resolve, 1000)
    })

    // Find all page divs by their data-page attribute
    const pageDivs = container.querySelectorAll<HTMLElement>('[data-page]')
    
    if (pageDivs.length === 0) {
      throw new Error('No pages rendered in the template.')
    }

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Capture each page separately
    for (let i = 0; i < pageDivs.length; i++) {
      const pageDiv = pageDivs[i]

      const canvas = await html2canvas(pageDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: pageDiv.scrollWidth,
        height: pageDiv.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)

      if (i > 0) {
        pdf.addPage()
      }

      // Each page image is placed at full A4 size
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST')
    }

    const filenamePrefix =
      esalType === 'simplified'
        ? 'Flexible-Simplified-ESAL-Factor-Report'
        : pavementType === 'flexible'
          ? 'Flexible-AASHTO-ESAL-Factor-Report'
          : 'Rigid-AASHTO-ESAL-Factor-Report'

    const filename =
      filenamePrefix + '_' + new Date().toISOString().split('T')[0] + '.pdf'

    pdf.save(filename)
    
    // Cleanup
    root.unmount()
    document.body.removeChild(container)
  } catch (error) {
    console.error('PDF Generation Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    alert('Failed to generate PDF: ' + errorMessage)
    
    // Cleanup on error
    try {
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
    } catch (e) {
      // Ignore cleanup error
    }
  }
}
