
import React from 'react';
import { FileDown, FileText } from 'lucide-react';
import { VehicleEsalData } from '../DesignEsalTable';
import { exportCalculationResults } from './utils';
import { generateDesignEsalPDF } from './DesignEsalPdfGenerator';
import { FormValues, GrowthRateType} from './types';
import { CompanyDetails } from '../../types/truckFactor'

interface ResultsExportProps {
  showResults: boolean;
  vehicleData: VehicleEsalData[];
  formValues: FormValues;
  totalDesignEsals: number;
  growthRateType: GrowthRateType;
  companyDetails: CompanyDetails;
}

const ResultsExport: React.FC<ResultsExportProps> = ({
  showResults,
  vehicleData,
  formValues,
  totalDesignEsals,
  companyDetails,
  growthRateType
}) => {
  const handleExportCSV = () => {
    if (!showResults || vehicleData.length === 0) return;
    exportCalculationResults(
      vehicleData,
      formValues,
      totalDesignEsals
    );
  };
  
  const handleExportPDF = () => {
    if (!showResults || vehicleData.length === 0) return;
    
    generateDesignEsalPDF({
      vehicleData,
      formValues,
      totalDesignEsals,
      companyDetails,
      growthRateType: 
        growthRateType === GrowthRateType.CONSTANT ? 'Constant' : 
        growthRateType === GrowthRateType.YEARLY ? 'Yearly Variable' : 
        'Range-Based Variable'
    });
  };

  return (
    <div className="flex justify-end gap-4">
      <button 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2"
        onClick={handleExportCSV}
        disabled={!showResults || vehicleData.length === 0}
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export as CSV
      </button>
      
      <button 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-green-500 bg-green-50 text-green-700 shadow-sm hover:bg-green-100 h-9 px-4 py-2"
        onClick={handleExportPDF}
        disabled={!showResults || vehicleData.length === 0}
      >
        <FileText className="mr-2 h-4 w-4" />
        Generate PDF Report
      </button>
    </div>
  );
};

export default ResultsExport;
