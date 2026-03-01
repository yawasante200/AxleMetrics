import jsPDF from 'jspdf';
import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues, ReportMetadata, ESALRoundingOption, GrowthRateType, YearlyESALData } from './types';
import { CompanyDetails } from '../../types/truckFactor';
import { calculateYearlyESALData, roundESAL } from './utils';
import DesignESALReportTemplate from '../report/DesignESALReportTemplate';

interface GeneratePDFProps {
  vehicleData: VehicleEsalData[];
  formValues: FormValues;
  totalDesignEsals: number;
  growthRateType: GrowthRateType;
  companyDetails?: CompanyDetails;
  reportMetadata?: ReportMetadata;
  esalRoundingOption?: ESALRoundingOption;
}

/**
 * Design ESAL PDF generator using html2canvas + React Template.
 * Each logical page is rendered as a separate A4-sized div and captured
 * individually, ensuring clean page breaks with no content splitting.
 */
export const generateDesignEsalPDF = async ({
  vehicleData,
  formValues,
  totalDesignEsals,
  growthRateType,
  companyDetails,
  reportMetadata,
  esalRoundingOption = ESALRoundingOption.NONE
}: GeneratePDFProps): Promise<void> => {
  if (!vehicleData || vehicleData.length === 0) {
    alert('No data available to generate PDF.');
    return;
  }

  // Safe defaults
  const safeCompanyDetails: CompanyDetails = companyDetails || {
    company: '',
    address: '',
    phone: '',
    date: new Date().toLocaleDateString(),
    project: '',
    name: ''
  };

  const yearlyESALData: YearlyESALData[] = calculateYearlyESALData(vehicleData, formValues);

  // Apply rounding
  const roundedVehicleData = vehicleData.map(v => ({
    ...v,
    designEsals: roundESAL(v.designEsals, esalRoundingOption)
  }));
  const roundedTotalEsals = roundESAL(totalDesignEsals, esalRoundingOption);
  const roundedYearlyData = yearlyESALData.map(d => ({
    ...d,
    yearlyESAL: roundESAL(d.yearlyESAL, esalRoundingOption),
    cumulativeESAL: roundESAL(d.cumulativeESAL, esalRoundingOption)
  }));

  // Create a hidden container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  document.body.appendChild(container);

  try {
    const root = createRoot(container);
    
    // Render the React template (which outputs multiple page divs)
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(DesignESALReportTemplate, {
          vehicleData: roundedVehicleData,
          formValues,
          totalDesignEsals: roundedTotalEsals,
          yearlyESALData: roundedYearlyData,
          companyDetails: safeCompanyDetails,
          growthRateType,
          reportMetadata
        })
      );
      // Extra delay for chart SVG and icons
      setTimeout(resolve, 1200);
    });

    // Find all page divs by their data-page attribute
    const pageDivs = container.querySelectorAll<HTMLElement>('[data-page]');
    
    if (pageDivs.length === 0) {
      throw new Error('No pages rendered in the template.');
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Capture each page separately
    for (let i = 0; i < pageDivs.length; i++) {
      const pageDiv = pageDivs[i];

      const canvas = await html2canvas(pageDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: pageDiv.scrollWidth,
        height: pageDiv.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }

    const filename = `Design-ESAL-Report_${formValues.designPeriod}-Year_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    // Cleanup
    root.unmount();
    document.body.removeChild(container);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert('Failed to generate PDF: ' + errorMessage);
    
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};