import React from 'react';
import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues, YearlyESALData, GrowthRateType, ReportMetadata } from '../design-esal/types';
import { CompanyDetails } from '../../types/truckFactor';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import YearlyESALChart from '../charts/YearlyESALChart';

interface DesignESALReportTemplateProps {
  vehicleData: VehicleEsalData[];
  formValues: FormValues;
  totalDesignEsals: number;
  yearlyESALData: YearlyESALData[];
  companyDetails: CompanyDetails;
  growthRateType: GrowthRateType;
  reportMetadata?: ReportMetadata;
}

/**
 * A4 page wrapper — exactly 210mm × 297mm, flexbox column so footer
 * is always pushed to the bottom of the page.
 */
const PageWrapper: React.FC<{
  children: React.ReactNode;
  reportDate?: string;
  pageNumber: number;
  totalPages: number;
}> = ({ children, reportDate, pageNumber, totalPages }) => (
  <div
    className="bg-white w-[210mm] font-sans text-gray-900"
    style={{
      width: '210mm',
      height: '297mm',
      padding: '12mm 14mm',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}
    data-page={pageNumber}
  >
    <div style={{ flex: 1 }}>{children}</div>
    <ReportFooter
      reportDate={reportDate}
      pageNumber={pageNumber}
      totalPages={totalPages}
    />
  </div>
);

const DesignESALReportTemplate: React.FC<DesignESALReportTemplateProps> = ({
  vehicleData,
  formValues,
  totalDesignEsals,
  yearlyESALData,
  companyDetails,
  growthRateType,
  reportMetadata
}) => {
  const baseYear = formValues.baseYear;
  const designYear = baseYear + formValues.designPeriod;
  
  // Combine metadata for display
  const displayLocation = reportMetadata?.projectLocation || companyDetails.projectLocation || 'N/A';
  const displayLength = reportMetadata?.projectLength 
    ? `${reportMetadata.projectLength} ${reportMetadata.projectLengthUnit}` 
    : companyDetails.projectLength 
      ? `${companyDetails.projectLength} ${companyDetails.projectLengthUnit || 'km'}`
      : 'N/A';
  const displayAnalyst = reportMetadata?.analystName || companyDetails.analystName || companyDetails.name || 'N/A';

  const ddf = formValues.directionDistribution / 100;
  const ldf = formValues.laneDistribution / 100;

  // Batch the vehicle data rows for the computation table.
  // Page 3 is after the chart page, so we have full space.
  // We'll put all rows on one page if ≤ 15 rows, otherwise batch.
  const ROWS_PER_PAGE = 12;
  const vehicleBatches: VehicleEsalData[][] = [];
  for (let i = 0; i < vehicleData.length; i += ROWS_PER_PAGE) {
    vehicleBatches.push(vehicleData.slice(i, i + ROWS_PER_PAGE));
  }

  // Total pages: Page 1 (info + summary), Page 2 (chart), Page 3+ (computation table batches)
  const totalPages = 2 + vehicleBatches.length;

  return (
    <div>
      {/* ═══════════ PAGE 1: Info, Parameters, Summary Stat ═══════════ */}
      <PageWrapper
        reportDate={companyDetails.date}
        pageNumber={1}
        totalPages={totalPages}
      >
        <ReportHeader
          reportTitle="TRAFFIC ANALYSIS REPORT"
          reportSubtitle={`${formValues.designPeriod}-Year Design ESAL Computation`}
        />

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Company Information */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Company Information</h4>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Company</p>
                <p className="text-sm font-bold text-gray-800">{companyDetails.company || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Phone</p>
                <p className="text-sm font-bold text-gray-800">{companyDetails.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Address</p>
                <p className="text-sm font-bold text-gray-800 whitespace-pre-wrap">{companyDetails.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Project Summary</h4>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Project Name</p>
                <p className="text-sm font-bold text-gray-800">{companyDetails.project || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Prepared By</p>
                <p className="text-sm font-bold text-gray-800">{displayAnalyst}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm mb-6">
          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 text-center">Project Details</h4>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Location</p>
              <p className="text-sm font-bold text-gray-800">{displayLocation}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Length</p>
              <p className="text-sm font-bold text-gray-800">{displayLength}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Date</p>
              <p className="text-sm font-bold text-gray-800">{companyDetails.date || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Input Unit</p>
              <p className="text-sm font-bold text-gray-800 uppercase">{companyDetails.inputDataUnit || 'kg'}</p>
            </div>
          </div>
        </div>

        {/* Design Parameters */}
        <div className="bg-gray-800 rounded-xl p-5 text-white mb-6 shadow-inner">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 text-center">Design Parameters</h4>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">{baseYear} 2-Way AADT</p>
              <p className="text-sm font-bold">{formValues.aadt.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Design Period</p>
              <p className="text-sm font-bold">{formValues.designPeriod} Years</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">DDF / LDF</p>
              <p className="text-sm font-bold">{ddf.toFixed(2)} / {ldf.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Growth Type</p>
              <p className="text-sm font-bold capitalize">{growthRateType}</p>
            </div>
          </div>
        </div>

        {/* Summary Stat */}
        <div className="p-8 bg-blue-600 rounded-2xl text-white text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L3 18" />
            </svg>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 opacity-80">Total Design ESALs ({designYear})</p>
          <h2 className="text-5xl font-black tabular-nums">{Math.round(totalDesignEsals).toLocaleString()}</h2>
        </div>
      </PageWrapper>

      {/* ═══════════ PAGE 2: Chart ═══════════ */}
      <PageWrapper
        reportDate={companyDetails.date}
        pageNumber={2}
        totalPages={totalPages}
      >
        <ReportHeader
          reportTitle="ESAL ANALYSIS"
          reportSubtitle={`Yearly Design ESAL Progression (${baseYear} – ${designYear})`}
        />
        <div className="mt-4">
          <YearlyESALChart data={yearlyESALData} title={`Yearly Design ESAL vs Year (${baseYear} - ${designYear})`} />
        </div>
      </PageWrapper>

      {/* ═══════════ PAGES 3+: Computation Table ═══════════ */}
      {vehicleBatches.map((batch, batchIdx) => (
        <PageWrapper
          key={batchIdx}
          reportDate={companyDetails.date}
          pageNumber={batchIdx + 3}
          totalPages={totalPages}
        >
          <ReportHeader
            reportTitle="COMPUTATION DETAILS"
            reportSubtitle="Vehicle Classification & ESAL Breakdown"
          />
          
          <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <table className="w-full text-[10px] text-left">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-3 py-3 font-bold uppercase tracking-wider">Class</th>
                  <th className="px-3 py-3 font-bold uppercase tracking-wider text-center">% AADT</th>
                  <th className="px-3 py-3 font-bold uppercase tracking-wider text-center">Design Lane AADT</th>
                  <th className="px-3 py-3 font-bold uppercase tracking-wider text-center">Growth Factor</th>
                  <th className="px-3 py-3 font-bold uppercase tracking-wider text-center">Truck Factor</th>
                  <th className="px-3 py-3 font-bold uppercase tracking-wider text-right">Design ESALs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {batch.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-3 font-bold text-gray-800">{row.vehicleClass}</td>
                    <td className="px-3 py-3 text-center">{row.percentOfAadt}%</td>
                    <td className="px-3 py-3 text-center">{Math.round(row.designLaneAadt).toLocaleString()}</td>
                    <td className="px-3 py-3 text-center">{row.growthFactor.toFixed(3)}</td>
                    <td className="px-3 py-3 text-center">{row.truckFactor.toFixed(3)}</td>
                    <td className="px-3 py-3 font-bold text-blue-700 text-right">{Math.round(row.designEsals).toLocaleString()}</td>
                  </tr>
                ))}
                {/* Show total only on the last batch */}
                {batchIdx === vehicleBatches.length - 1 && (
                  <tr className="bg-blue-50 font-black">
                    <td className="px-3 py-4 text-gray-900">TOTAL</td>
                    <td className="px-3 py-4 text-center">100%</td>
                    <td colSpan={3}></td>
                    <td className="px-3 py-4 text-right text-blue-800">{Math.round(totalDesignEsals).toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </PageWrapper>
      ))}
    </div>
  );
};

export default DesignESALReportTemplate;
