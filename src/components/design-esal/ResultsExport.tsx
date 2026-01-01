import React, { useState } from 'react';
import { FileDown, FileText, AlertTriangle } from 'lucide-react';
import { VehicleEsalData } from '../DesignEsalTable';
import { exportCalculationResults, roundESAL } from './utils';
import { generateDesignEsalPDF } from './DesignEsalPdfGenerator';
import { FormValues, GrowthRateType, ESALRoundingOption } from './types';
import { CompanyDetails } from '../../types/truckFactor';

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
  const [esalRoundingOption, setEsalRoundingOption] = useState<ESALRoundingOption>(ESALRoundingOption.NEAREST_1000);

  // Calculate AADT total percentage
  const aadtTotalPercentage = vehicleData.reduce((sum, v) => sum + v.percentOfAadt, 0);
  const hasAadtWarning = Math.abs(aadtTotalPercentage - 100) >= 0.1;

  // Format rounded ESAL for display
  const roundedEsal = roundESAL(totalDesignEsals, esalRoundingOption);
  const formatRoundedValue = (value: number): string => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)} billion`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)} million`;
    return value.toLocaleString();
  };

  const handleExportCSV = () => {
    if (!showResults || vehicleData.length === 0) return;
    exportCalculationResults(vehicleData, formValues, totalDesignEsals);
  };
  
  const handleExportPDF = () => {
    if (!showResults || vehicleData.length === 0) return;
    
    // Build reportMetadata from companyDetails
    const reportMetadata = companyDetails.projectLocation ? {
      projectLocation: companyDetails.projectLocation || '',
      projectLength: companyDetails.projectLength || 0,
      projectLengthUnit: companyDetails.projectLengthUnit || 'km',
      analystName: companyDetails.analystName || companyDetails.name || ''
    } : undefined;
    
    generateDesignEsalPDF({
      vehicleData,
      formValues,
      totalDesignEsals,
      companyDetails,
      growthRateType: 
        growthRateType === GrowthRateType.CONSTANT ? 'Constant' : 
        growthRateType === GrowthRateType.YEARLY ? 'Yearly Variable' : 
        'Range-Based Variable',
      reportMetadata,
      esalRoundingOption
    });
  };

  return (
    <div className="space-y-4">
      {/* AADT Validation Warning */}
      {hasAadtWarning && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Warning: AADT percentages do not sum to 100%
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Current total: {aadtTotalPercentage.toFixed(1)}%. Please verify your traffic distribution data.
            </p>
          </div>
        </div>
      )}

      {/* ESAL Rounding Options */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Design ESAL Rounding
            </label>
            <select
              value={esalRoundingOption}
              onChange={(e) => setEsalRoundingOption(Number(e.target.value) as ESALRoundingOption)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value={ESALRoundingOption.NEAREST_100}>Nearest 100</option>
              <option value={ESALRoundingOption.NEAREST_1000}>Nearest 1,000</option>
              <option value={ESALRoundingOption.NEAREST_MILLION}>Nearest 1,000,000</option>
              <option value={ESALRoundingOption.NEAREST_BILLION}>Nearest Billion</option>
            </select>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Rounded Design ESAL</p>
            <p className="text-lg font-bold text-gray-900">{formatRoundedValue(roundedEsal)}</p>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
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
    </div>
  );
};

export default ResultsExport;
