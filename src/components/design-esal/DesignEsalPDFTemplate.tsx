import React from 'react';
import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues } from './types';
import { CompanyDetails } from '../../types/truckFactor';
import { VehicleClassificationTable } from '../VehicleIllustrations';
import { formatGrowthRate } from './utils';

interface DesignEsalPDFTemplateProps {
  vehicleData: VehicleEsalData[];
  formValues: FormValues;
  totalDesignEsals: number;
  companyDetails?: CompanyDetails;
}

const DesignEsalPDFTemplate: React.FC<DesignEsalPDFTemplateProps> = ({
  vehicleData,
  formValues,
  totalDesignEsals,
  companyDetails
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

  return (
    <div 
      className="bg-white mx-auto print:shadow-none" 
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        padding: '18mm 22mm', 
        fontSize: '12pt',
        lineHeight: '1.5',
        textAlign: 'justify'
      }}
    >
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-7 pb-5 border-b-4 border-gray-800">
        <div className="flex items-center">
          <img 
            src="/Axle-logo.png" 
            alt="AxleMetrics Logo" 
            className="h-15 w-auto object-contain flex-shrink-0"
          />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Report Date</p>
          <p className="text-xl font-bold text-gray-900">{safeCompanyDetails.date}</p>
        </div>
      </div>

      {/* Report Title */}
      <div className="text-center mb-9">
        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-2">
          {formValues.designPeriod}-Year Design ESAL
        </h2>
        <h3 className="text-xl font-semibold text-gray-700">
          Flexible Pavement Design Report
        </h3>
      </div>

      {/* Company & Project Info */}
      <div className="grid grid-cols-2 gap-8 mb-7">
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <h4 className="text-base font-bold text-gray-700 uppercase tracking-wider mb-3 pb-2 border-b border-gray-300">
            Company Information
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Company</p>
              <p className="text-base font-semibold text-gray-900">{safeCompanyDetails.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Phone</p>
              <p className="text-base font-semibold text-gray-900">{safeCompanyDetails.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Address</p>
              <p className="text-base font-semibold text-gray-900">{safeCompanyDetails.address}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <h4 className="text-base font-bold text-gray-700 uppercase tracking-wider mb-3 pb-2 border-b border-gray-300">
            Project Summary
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Project Name</p>
              <p className="text-base font-semibold text-gray-900">{safeCompanyDetails.project}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Prepared By</p>
              <p className="text-base font-semibold text-gray-900">{safeCompanyDetails.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Design Parameters */}
      <div className="bg-gray-50 rounded-lg p-5 mb-7 border border-gray-200">
        <h4 className="text-base font-bold text-gray-700 uppercase tracking-wider mb-3 pb-2 border-b border-gray-300">
          Design Parameters
        </h4>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Base Year AADT</p>
            <p className="text-base font-semibold text-gray-900">{formValues.aadt.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Design Period</p>
            <p className="text-base font-semibold text-gray-900">{formValues.designPeriod} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Base Year</p>
            <p className="text-base font-semibold text-gray-900">{baseYear}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Design Year</p>
            <p className="text-base font-semibold text-gray-900">{designYear}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Direction Distribution</p>
            <p className="text-base font-semibold text-gray-900">{formValues.directionDistribution}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Lane Distribution</p>
            <p className="text-base font-semibold text-gray-900">{formValues.laneDistribution}%</p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="mb-8">
        <h4 className="text-base font-bold text-gray-700 uppercase tracking-wider mb-4">
          Calculated Results
        </h4>
        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-3 px-3 font-bold text-left">Vehicle Class</th>
                <th className="py-3 px-3 font-bold text-center">{baseYear} AADT</th>
                <th className="py-3 px-3 font-bold text-center">Directional AADT</th>
                <th className="py-3 px-3 font-bold text-center">Design Lane AADT</th>
                <th className="py-3 px-3 font-bold text-center">Growth Rate</th>
                <th className="py-3 px-3 font-bold text-center">Growth Factor</th>
                <th className="py-3 px-3 font-bold text-center">Truck Factor</th>
                <th className="py-3 px-3 font-bold text-right">Design ESALs</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.map((vehicle, index) => (
                <tr 
                  key={index}
                  className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="py-3 px-3 font-medium text-gray-900">{vehicle.vehicleClass}</td>
                  <td className="py-3 px-3 text-center">{Math.round(vehicle.aadt).toLocaleString()}</td>
                  <td className="py-3 px-3 text-center">{Math.round(vehicle.directionalAadt).toLocaleString()}</td>
                  <td className="py-3 px-3 text-center">{Math.round(vehicle.designLaneAadt).toLocaleString()}</td>
                  <td className="py-3 px-3 text-center">{formatGrowthRate(vehicle.growthRate)}</td>
                  <td className="py-3 px-3 text-center">{vehicle.growthFactor.toFixed(2)}</td>
                  <td className="py-3 px-3 text-center">{vehicle.truckFactor.toFixed(4)}</td>
                  <td className="py-3 px-3 text-right font-mono">{Math.round(vehicle.designEsals).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-800 text-white font-bold">
                <td colSpan={7} className="py-3 px-3 text-right">
                  Total {formValues.designPeriod}-Year Design ESALs:
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {Math.round(totalDesignEsals).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Vehicle Classification Reference - New Page */}
      <div 
        className="bg-white" 
        style={{ 
          pageBreakBefore: 'always', 
          paddingTop: '20mm',
          minHeight: '250mm'
        }}
      >
        <VehicleClassificationTable />
        
        {/* Footer on same page as classifications */}
        <div className="mt-auto pt-8 border-t border-gray-300" style={{ marginTop: '40mm' }}>
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600 font-medium">
              © {new Date().getFullYear()} AxleMetrics 
            </p>
            <p className="text-sm text-gray-500">
              This report is generated based on AASHTO methods
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignEsalPDFTemplate;

