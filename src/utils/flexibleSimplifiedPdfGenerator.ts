import React from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Result, CompanyDetails } from '../types/truckFactor'
import { ESALConfig } from '../types/config'
import { ReportMetadata } from '../components/design-esal/types'
import { createRoot } from 'react-dom/client'
import PDFTemplate from '../components/PDFTemplate'

export const generateFlexibleSimplifiedPDF = async (
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

    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(PDFTemplate, {
          formData: formData,
          results: data,
          config: config,
          pavementType: 'flexible',
          esalType: 'simplified',
          reportMetadata: reportMetadata,
          aadtTotalPercentage: aadtTotalPercentage
        })
      )
      setTimeout(resolve, 800)
    })

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    await new Promise(resolve => setTimeout(resolve, 200))

    // Capture main content - OPTIMIZED
    const contentElement = container.querySelector('#pdf-content') as HTMLElement
    if (contentElement) {
      const canvas = await html2canvas(contentElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.85)
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
    }

    // Capture vehicles - OPTIMIZED
    const vehiclesElement = container.querySelector('#pdf-vehicles') as HTMLElement
    if (vehiclesElement) {
      const canvas = await html2canvas(vehiclesElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.85)
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
    }

    const filename =
      'Flexible-Simplified-Highway-Design-Report_' +
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