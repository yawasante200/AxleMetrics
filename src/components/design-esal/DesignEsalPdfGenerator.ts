import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { createRoot } from 'react-dom/client';
import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues } from './types';
import { CompanyDetails } from '../../types/truckFactor';
import DesignEsalPDFTemplate from './DesignEsalPDFTemplate';

interface GeneratePDFProps {
  vehicleData: VehicleEsalData[];
  formValues: FormValues;
  totalDesignEsals: number;
  growthRateType: string;
  companyDetails?: CompanyDetails;
}

export const generateDesignEsalPDF = async ({
  vehicleData,
  formValues,
  totalDesignEsals,
  growthRateType: _growthRateType,
  companyDetails
}: GeneratePDFProps): Promise<void> => {
  if (!vehicleData || vehicleData.length === 0) {
    alert('No data available to generate PDF.');
    return;
  }

  try {
    // Create off-screen container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm';
    document.body.appendChild(container);

    const root = createRoot(container);

    // Render the template
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(DesignEsalPDFTemplate, {
          vehicleData,
          formValues,
          totalDesignEsals,
          companyDetails
        })
      );
      // Wait for render to complete
      setTimeout(resolve, 200);
    });

    // Capture as canvas
    const canvas = await html2canvas(container.firstChild as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // A4 width in pixels at 96dpi
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate scaling to fit width
    const ratio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;
    
    // Handle multi-page content
    let position = 0;
    let remainingHeight = scaledHeight;
    
    while (remainingHeight > 0) {
      // Create a canvas for the current page slice
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(canvas.height - (position / ratio), pdfHeight / ratio);
      
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvas,
          0, position / ratio,                          // Source X, Y
          canvas.width, pageCanvas.height,              // Source Width, Height
          0, 0,                                         // Destination X, Y
          canvas.width, pageCanvas.height               // Destination Width, Height
        );
        
        const pageImgData = pageCanvas.toDataURL('image/png');
        
        if (position > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageCanvas.height * ratio);
      }
      
      position += pdfHeight;
      remainingHeight -= pdfHeight;
    }

    // Generate filename
    const filename = `Design-ESAL-Report_${formValues.designPeriod}-Year_${new Date().toISOString().split('T')[0]}.pdf`;

    // Save PDF
    pdf.save(filename);

    // Cleanup
    root.unmount();
    document.body.removeChild(container);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert('Failed to generate PDF: ' + errorMessage);
  }
};