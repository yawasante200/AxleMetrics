import React from 'react';
import { Result, CompanyDetails } from '../types/truckFactor';
import { ESALConfig } from '../types/config';
import { VehicleClassificationTable } from './VehicleIllustrations';
import { ReportMetadata } from './design-esal/types';

interface PDFTemplateProps {
  formData: CompanyDetails;
  results: Result[];
  config: ESALConfig;
  pavementType: 'flexible' | 'rigid';
  esalType: 'simplified' | 'AASHTO';
  reportMetadata?: ReportMetadata;
  aadtTotalPercentage?: number;
}

const PDFTemplate: React.FC<PDFTemplateProps> = ({
  formData,
  results,
  config,
  pavementType,
  esalType,
  reportMetadata,
  aadtTotalPercentage = 100
}) => {
  const getReportTitle = () => {
    const pavementText = pavementType === 'flexible' ? 'Flexible' : 'Rigid';
    const methodText = esalType === 'simplified' ? 'Simplified' : 'Original';
    return `${pavementText} Pavement ${methodText} AASHO ESAL Factor`;
  };

  const getCalculationMethod = () => {
    if (esalType === 'simplified') {
      return 'Simplified AASHO Equations';
    }
    return 'Original AASHO Equations';
  };

  const getParameters = () => {
    if (esalType === 'simplified') {
      return {
        param1Label: 'Standard Load',
        param1Value: `${config.standardAxleLoads.single[config.unit]} ${config.unit}`,
        param2Label: 'Load Equivalency Factor (c)',
        param2Value: config.loadEquivalencyExponent.toString()
      };
    } else if (pavementType === 'flexible') {
      return {
        param1Label: 'Terminal Serviceability (pt)',
        param1Value: config.ptVal.toString(),
        param2Label: 'Structural Number (SN)',
        param2Value: config.snVal.toString()
      };
    } else {
      return {
        param1Label: 'Terminal Serviceability (pt)',
        param1Value: config.ptVal.toString(),
        param2Label: 'Slab Thickness (D)',
        param2Value: config.dVal.toString()
      };
    }
  };

  const parameters = getParameters();
  const showAadtWarning = Math.abs(aadtTotalPercentage - 100) >= 0.01;

  return (
    <div className="bg-white mx-auto print:shadow-none">
      {/* PAGE 1+: Main Report Content (can span multiple pages) */}
      <div
        id="pdf-content"
        style={{ 
          width: '210mm', 
          padding: '20mm 25mm', 
          fontSize: '11pt',
          lineHeight: '1.4',
          boxSizing: 'border-box'
        }}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-900">
          <div className="flex items-center">
            <img 
              src="/Axle-logo.png" 
              alt="AxleMetrics Logo" 
              className="h-12 w-auto object-contain flex-shrink-0"
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Report Date</p>
            <p className="text-lg font-bold text-gray-900">{formData.date}</p>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide mb-1">
            Highway Pavement Design Report
          </h2>
          <h3 className="text-base font-normal text-gray-700">
            {getReportTitle()}
          </h3>
        </div>

        {/* AADT Validation Warning */}
        {showAadtWarning && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Warning: AADT percentages do not sum to 100%
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Current total: {aadtTotalPercentage.toFixed(1)}%. Please verify your traffic distribution data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Project Metadata (if provided) */}
        {reportMetadata && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Project Information
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Project Location</p>
                <p className="text-sm font-medium text-gray-900">{reportMetadata.projectLocation || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Project Length</p>
                <p className="text-sm font-medium text-gray-900">
                  {reportMetadata.projectLength ? `${reportMetadata.projectLength} ${reportMetadata.projectLengthUnit}` : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Analyst/Designer</p>
                <p className="text-sm font-medium text-gray-900">{reportMetadata.analystName || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Company & Project Info - Side by side */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          {/* Company Information */}
          <div className="bg-gray-50 rounded p-4 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Company Information
            </h4>
            <div className="space-y-2.5">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Company</p>
                <p className="text-sm font-medium text-gray-900">{formData.company}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Phone</p>
                <p className="text-sm font-medium text-gray-900">{formData.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Address</p>
                <p className="text-sm font-medium text-gray-900">{formData.address}</p>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <div className="bg-gray-50 rounded p-4 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Project Summary
            </h4>
            <div className="space-y-2.5">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Project Name</p>
                <p className="text-sm font-medium text-gray-900">{formData.project}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Prepared By</p>
                <p className="text-sm font-medium text-gray-900">{formData.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Parameters */}
        <div className="bg-gray-50 rounded p-4 mb-10 border border-gray-200">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            Calculation Parameters
          </h4>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Computation Method</p>
              <p className="text-sm font-medium text-gray-900">{getCalculationMethod()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">{parameters.param1Label}</p>
              <p className="text-sm font-medium text-gray-900">{parameters.param1Value}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">{parameters.param2Label}</p>
              <p className="text-sm font-medium text-gray-900">{parameters.param2Value}</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-12">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            Calculated Results
          </h4>
          <p className="text-xs text-gray-600 mb-4">
            Summary of axle types and their respective Equivalent Single Axle Load (ESAL) factors.
          </p>

          <div className="overflow-hidden rounded border border-gray-300">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left py-3 px-5 text-xs font-bold uppercase tracking-wider">
                    Axle Type
                  </th>
                  <th className="text-right py-3 px-5 text-xs font-bold uppercase tracking-wider">
                    Average ESAL Factor
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr 
                    key={index}
                    className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    style={{ breakInside: 'avoid' } as React.CSSProperties}
                  >
                    <td className="py-3 px-5 text-sm font-medium text-gray-900">
                      {result.axleType}
                    </td>
                    <td className="py-3 px-5 text-sm font-medium text-right text-gray-900 tabular-nums">
                      {result.averageESAL.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer for Page 1 */}
        <div className="mt-12 pt-6 border-t border-gray-300">
          <div className="text-center space-y-0.5">
            <p className="text-xs text-gray-600 font-medium">
              © 2026 AxleMetrics - Professional Pavement Analysis Solutions
            </p>
            <p className="text-xs text-gray-500">
              This report is generated based on AASHTO methods
            </p>
          </div>
        </div>
      </div>

      {/* LAST PAGE: Vehicle Classifications (always on separate page) */}
      <div 
        id="pdf-vehicles"
        className="bg-white" 
        style={{ 
          width: '210mm',
          padding: '20mm 25mm',
          boxSizing: 'border-box',
          marginTop: '20mm' // Space separation for visual clarity
        }}
      >
        {/* Header for Page 2 */}
        <div className="mb-8 pb-4 border-b-2 border-gray-900">
          <img 
            src="/Axle-logo.png" 
            alt="AxleMetrics Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>

        <VehicleClassificationTable />
        
        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-gray-300" style={{ marginTop: '30mm' }}>
          <div className="text-center space-y-0.5">
            <p className="text-xs text-gray-600 font-medium">
              © 2026 AxleMetrics - Professional Pavement Analysis Solutions
            </p>
            <p className="text-xs text-gray-500">
              This report is generated based on AASHTO methods
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTemplate;