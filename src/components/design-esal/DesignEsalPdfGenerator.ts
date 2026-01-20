import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { createRoot } from 'react-dom/client';
import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues, ReportMetadata, ESALRoundingOption } from './types';
import { CompanyDetails } from '../../types/truckFactor';
import DesignEsalPDFTemplate from './DesignEsalPDFTemplate';

interface GeneratePDFProps {
  vehicleData: VehicleEsalData[];
  formValues: FormValues;
  totalDesignEsals: number;
  growthRateType: string;
  companyDetails?: CompanyDetails;
  reportMetadata?: ReportMetadata;
  esalRoundingOption?: ESALRoundingOption;
}

// Helper function to wait for images to load
const waitForImagesToLoad = (container: HTMLElement): Promise<void> => {
  const images = container.getElementsByTagName('img');
  const promises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      setTimeout(() => resolve(), 3000);
    });
  });
  return Promise.all(promises).then(() => {});
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
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm';
    document.body.appendChild(container);

    const root = createRoot(container);

    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(DesignEsalPDFTemplate, {
          vehicleData,
          formValues,
          totalDesignEsals,
          companyDetails,
          reportMetadata,
          esalRoundingOption
        })
      );
      setTimeout(resolve, 500);
    });

    await waitForImagesToLoad(container);
    await new Promise(resolve => setTimeout(resolve, 200));

    const content = container.firstChild as HTMLElement;
    
    // Find all page break elements
    const pageElements = content.querySelectorAll('[style*="pageBreakBefore"]');
    const allPages: HTMLElement[] = [];
    
    if (pageElements.length > 0) {
      const firstPageContent = document.createElement('div');
      firstPageContent.style.width = '210mm';
      firstPageContent.style.background = '#ffffff';
      
      const children = Array.from(content.children);
      const firstBreakIndex = children.indexOf(pageElements[0] as Element);
      
      for (let i = 0; i < firstBreakIndex; i++) {
        firstPageContent.appendChild(children[i].cloneNode(true));
      }
      allPages.push(firstPageContent);
      
      pageElements.forEach((pageElement) => {
        const pageContent = document.createElement('div');
        pageContent.style.width = '210mm';
        pageContent.style.background = '#ffffff';
        pageContent.appendChild(pageElement.cloneNode(true));
        allPages.push(pageContent);
      });
    } else {
      const singlePage = document.createElement('div');
      singlePage.style.width = '210mm';
      singlePage.style.background = '#ffffff';
      singlePage.appendChild(content.cloneNode(true));
      allPages.push(singlePage);
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let pageIndex = 0; pageIndex < allPages.length; pageIndex++) {
      const pageContent = allPages[pageIndex];
      document.body.appendChild(pageContent);
      
      await new Promise(resolve => setTimeout(resolve, 150));

      // OPTIMIZED: reduced scale, JPEG format
      const canvas = await html2canvas(pageContent, {
        scale: 1.5, // Reduced from 3
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        removeContainer: false,
        imageTimeout: 10000,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.85); // JPEG 85%
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let position = 0;
      let isFirstSlice = true;
      
      while (position < imgHeight) {
        if (!isFirstSlice || pageIndex > 0) {
          pdf.addPage();
        }
        
        const remainingHeight = imgHeight - position;
        const sliceHeight = Math.min(pdfHeight, remainingHeight);
        
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = (sliceHeight / imgHeight) * canvas.height;
        
        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            (position / imgHeight) * canvas.height,
            canvas.width,
            sliceCanvas.height,
            0,
            0,
            sliceCanvas.width,
            sliceCanvas.height
          );
          
          const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.85);
          pdf.addImage(sliceImgData, 'JPEG', 0, 0, pdfWidth, sliceHeight);
        }
        
        position += pdfHeight;
        isFirstSlice = false;
      }

      document.body.removeChild(pageContent);
    }

    const filename = `Highway-Pavement-Design-Report_${formValues.designPeriod}-Year_${new Date().toISOString().split('T')[0]}.pdf`;

    pdf.save(filename);

    root.unmount();
    document.body.removeChild(container);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert('Failed to generate PDF: ' + errorMessage);
    
    const containers = document.querySelectorAll('[style*="left: -9999px"]');
    containers.forEach(c => c.remove());
  }
};