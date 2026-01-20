import React from 'react';
import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues, ReportMetadata, ESALRoundingOption, YearlyESALData } from './types';
import { CompanyDetails } from '../../types/truckFactor';
import { VehicleClassificationTable } from '../VehicleIllustrations';
import { formatGrowthRate, calculateYearlyESALData, roundESAL, validateAADTPercentages } from './utils';
import YearlyESALChart from '../charts/YearlyESALChart';
import AADTValidationWarning from '../report/AADTValidationWarning';

interface DesignEsalPDFTemplateProps {
  vehicleData: VehicleEsalData[];
  formValues: FormValues;
  totalDesignEsals: number;
  companyDetails?: CompanyDetails;
  reportMetadata?: ReportMetadata;
  esalRoundingOption?: ESALRoundingOption;
}

const DesignEsalPDFTemplate: React.FC<DesignEsalPDFTemplateProps> = ({
  vehicleData,
  formValues,
  totalDesignEsals,
  companyDetails,
  reportMetadata,
  esalRoundingOption = ESALRoundingOption.NEAREST_1000
}) => {
  const baseYear = formValues.baseYear || new Date().getFullYear();
  const designYear = baseYear + formValues.designPeriod;
  
  const defaultCompanyDetails: CompanyDetails = {
    company: '',
    address: '',
    phone: '',
    date: new Date().toLocaleDateString(),
    project: '',
    name: ''
  };
  
  const safeCompanyDetails = companyDetails || defaultCompanyDetails;

  // Calculate yearly ESAL data for chart
  const yearlyESALData: YearlyESALData[] = calculateYearlyESALData(vehicleData, formValues);

  // Validate AADT percentages
  const percentages = vehicleData.map(v => v.percentOfAadt);
  const aadtValidation = validateAADTPercentages(percentages);

  // Round the total ESAL based on selected option
  const roundedTotalEsals = roundESAL(totalDesignEsals, esalRoundingOption);

  return (
    <div className="bg-white" style={{ width: '210mm' }}>
      {/* Page 1: Main Report */}
      <div 
        className="bg-white mx-auto print:shadow-none" 
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          padding: '18mm 22mm', 
          fontSize: '11pt',
          lineHeight: '1.4',
          textAlign: 'justify',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-gray-800">
          <div className="flex items-center">
            <img 
              src="/Axle-logo.png" 
              alt="AxleMetrics Logo" 
              className="h-12 w-auto object-contain flex-shrink-0"
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Report Date</p>
            <p className="text-lg font-bold text-gray-900">{safeCompanyDetails.date}</p>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide mb-1">
            Highway Pavement Design Report
          </h2>
          <h3 className="text-lg font-semibold text-gray-700">
            {formValues.designPeriod}-Year Design ESAL Analysis
          </h3>
        </div>

        {/* AADT Validation Warning */}
        {!aadtValidation.isValid && (
          <AADTValidationWarning 
            totalPercentage={aadtValidation.totalPercentage} 
            className="mb-4"
          />
        )}

        {/* Project Metadata (if provided) */}
        {reportMetadata && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Project Information
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                <p className="text-sm font-semibold text-gray-900">{reportMetadata.projectLocation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Length</p>
                <p className="text-sm font-semibold text-gray-900">
                  {reportMetadata.projectLength ? `${reportMetadata.projectLength} ${reportMetadata.projectLengthUnit}` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Analyst</p>
                <p className="text-sm font-semibold text-gray-900">{reportMetadata.analystName || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Company & Project Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 pb-1 border-b border-gray-300">
              Company Information
            </h4>
            <div className="space-y-1.5">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Company</p>
                <p className="text-sm font-semibold text-gray-900">{safeCompanyDetails.company}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{safeCompanyDetails.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 pb-1 border-b border-gray-300">
              Project Summary
            </h4>
            <div className="space-y-1.5">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Project Name</p>
                <p className="text-sm font-semibold text-gray-900">{safeCompanyDetails.project}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Prepared By</p>
                <p className="text-sm font-semibold text-gray-900">{safeCompanyDetails.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Design Parameters */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 pb-1 border-b border-gray-300">
            Design Parameters
          </h4>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Base Year AADT</p>
              <p className="text-sm font-semibold text-gray-900">{formValues.aadt.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Design Period</p>
              <p className="text-sm font-semibold text-gray-900">{formValues.designPeriod} years</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Base Year</p>
              <p className="text-sm font-semibold text-gray-900">{baseYear}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Design Year</p>
              <p className="text-sm font-semibold text-gray-900">{designYear}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Direction Distribution</p>
              <p className="text-sm font-semibold text-gray-900">{formValues.directionDistribution}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Lane Distribution</p>
              <p className="text-sm font-semibold text-gray-900">{formValues.laneDistribution}%</p>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Calculated Results
          </h4>
          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
            <table className="w-full border-collapse" style={{ fontSize: '8pt' }}>
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-1.5 px-1.5 font-bold text-left">Vehicle Class</th>
                  <th className="py-1.5 px-1.5 font-bold text-center">{baseYear} AADT</th>
                  <th className="py-1.5 px-1.5 font-bold text-center">Dir. AADT</th>
                  <th className="py-1.5 px-1.5 font-bold text-center">Lane AADT</th>
                  <th className="py-1.5 px-1.5 font-bold text-center">Growth Rate</th>
                  <th className="py-1.5 px-1.5 font-bold text-center">Growth Factor</th>
                  <th className="py-1.5 px-1.5 font-bold text-center">Truck Factor</th>
                  <th className="py-1.5 px-1.5 font-bold text-right">Design ESALs</th>
                </tr>
              </thead>
              <tbody>
                {vehicleData.map((vehicle, index) => (
                  <tr 
                    key={index}
                    className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    style={{ breakInside: 'avoid' } as React.CSSProperties}
                  >
                    <td className="py-1.5 px-1.5 font-medium text-gray-900">{vehicle.vehicleClass}</td>
                    <td className="py-1.5 px-1.5 text-center">{Math.round(vehicle.aadt).toLocaleString()}</td>
                    <td className="py-1.5 px-1.5 text-center">{Math.round(vehicle.directionalAadt).toLocaleString()}</td>
                    <td className="py-1.5 px-1.5 text-center">{Math.round(vehicle.designLaneAadt).toLocaleString()}</td>
                    <td className="py-1.5 px-1.5 text-center">{formatGrowthRate(vehicle.growthRate)}</td>
                    <td className="py-1.5 px-1.5 text-center">{vehicle.growthFactor.toFixed(2)}</td>
                    <td className="py-1.5 px-1.5 text-center">{vehicle.truckFactor.toFixed(4)}</td>
                    <td className="py-1.5 px-1.5 text-right font-mono">{Math.round(vehicle.designEsals).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-800 text-white font-bold">
                  <td colSpan={7} className="py-1.5 px-1.5 text-right">
                    Total {formValues.designPeriod}-Year Design ESALs:
                  </td>
                  <td className="py-1.5 px-1.5 text-right font-mono">
                    {roundedTotalEsals.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer on first page */}
        <div className="mt-auto pt-4 border-t border-gray-300">
          <div className="text-center space-y-0.5">
            <p className="text-xs text-gray-600 font-medium">
              © 2026 AxleMetrics 
            </p>
            <p className="text-xs text-gray-500">
              This report is generated based on AASHTO methods
            </p>
          </div>
        </div>
      </div>

      {/* Page 2: Yearly ESAL Chart */}
      <div 
        className="bg-white page-break" 
        style={{ 
          pageBreakBefore: 'always', 
          width: '210mm',
          minHeight: '297mm',
          padding: '18mm 22mm',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-gray-800">
          <img 
            src="/Axle-logo.png" 
            alt="AxleMetrics Logo" 
            className="h-12 w-auto object-contain"
          />
          <p className="text-lg font-bold text-gray-900">ESAL Analysis</p>
        </div>

        {/* Yearly ESAL Chart */}
        <YearlyESALChart 
          data={yearlyESALData} 
          title={`Yearly Design ESAL vs Year (${baseYear} - ${designYear})`}
          className="mb-8"
        />

        {/* Yearly ESAL Table */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
            Yearly ESAL Breakdown
          </h4>
          <div className="overflow-hidden rounded-lg border border-gray-300">
            <table className="w-full border-collapse" style={{ fontSize: '9pt' }}>
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-2 px-3 font-bold text-left">Year</th>
                  <th className="py-2 px-3 font-bold text-right">Yearly ESAL</th>
                  <th className="py-2 px-3 font-bold text-right">Cumulative ESAL</th>
                </tr>
              </thead>
              <tbody>
                {yearlyESALData.map((data, index) => (
                  <tr 
                    key={index}
                    className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    style={{ breakInside: 'avoid' } as React.CSSProperties}
                  >
                    <td className="py-2 px-3 font-medium text-gray-900">{data.year}</td>
                    <td className="py-2 px-3 text-right font-mono">{data.yearlyESAL.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono">{data.cumulativeESAL.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-gray-300">
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-600 font-medium">
              © 2026 AxleMetrics 
            </p>
            <p className="text-xs text-gray-500">
              This report is generated based on AASHTO methods
            </p>
          </div>
        </div>
      </div>

      {/* Page 3: Vehicle Classification Reference */}
      <div 
        className="bg-white page-break" 
        style={{ 
          pageBreakBefore: 'always', 
          width: '210mm',
          minHeight: '297mm',
          padding: '18mm 22mm',
          boxSizing: 'border-box'
        }}
      >
        <VehicleClassificationTable />
      </div>
    </div>
  );
};

export default DesignEsalPDFTemplate;