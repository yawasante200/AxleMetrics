import React from 'react';
import { Result, CompanyDetails } from '../../types/truckFactor';
import { ESALConfig } from '../../types/config';
import { vehicleClassifications, ConfigurationDiagram } from '../VehicleIllustrations';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';

interface ESALFactorReportTemplateProps {
  data: Result[];
  formData: CompanyDetails;
  config: ESALConfig;
  pavementType: 'flexible' | 'rigid';
  esalType: 'simplified' | 'AASHTO';
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

const ESALFactorReportTemplate: React.FC<ESALFactorReportTemplateProps> = ({
  data,
  formData,
  config,
  pavementType,
  esalType
}) => {
  const pavementText = pavementType === 'flexible' ? 'Flexible' : 'Rigid';
  const methodText = esalType === 'simplified' ? 'Simplified' : 'Original';
  const subtitle = `${pavementText} Pavement ${methodText} AASHO ESAL Factor`;

  const calculationMethod =
    esalType === 'simplified'
      ? 'Simplified AASHO Equations'
      : 'Original AASHO Equations';

  // Split vehicle classifications into batches of 8 per page
  const ITEMS_PER_PAGE = 8;
  const vehicleBatches: typeof vehicleClassifications[] = [];
  for (let i = 0; i < vehicleClassifications.length; i += ITEMS_PER_PAGE) {
    vehicleBatches.push(vehicleClassifications.slice(i, i + ITEMS_PER_PAGE));
  }

  const totalPages = 1 + vehicleBatches.length; // Page 1: main content, rest: vehicle ref

  return (
    <div>
      {/* ═══════════ PAGE 1: Main Content ═══════════ */}
      <PageWrapper
        reportDate={formData.date}
        pageNumber={1}
        totalPages={totalPages}
      >
        <ReportHeader
          reportTitle="ESAL FACTOR REPORT"
          reportSubtitle={subtitle}
        />

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Company Information */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Company Information</h4>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Company</p>
                <p className="text-sm font-bold text-gray-800">{formData.company || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Phone</p>
                <p className="text-sm font-bold text-gray-800">{formData.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Address</p>
                <p className="text-sm font-bold text-gray-800 whitespace-pre-wrap">{formData.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Project Summary</h4>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Project Name</p>
                <p className="text-sm font-bold text-gray-800">{formData.project || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Prepared By</p>
                <p className="text-sm font-bold text-gray-800">{formData.analystName || formData.name || 'N/A'}</p>
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
              <p className="text-sm font-bold text-gray-800">{formData.projectLocation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Length</p>
              <p className="text-sm font-bold text-gray-800">
                {formData.projectLength ? `${formData.projectLength} ${formData.projectLengthUnit || 'km'}` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Date</p>
              <p className="text-sm font-bold text-gray-800">{formData.date || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Input Data Unit</p>
              <p className="text-sm font-bold text-gray-800 uppercase">{formData.inputDataUnit || 'kg'}</p>
            </div>
          </div>
        </div>

        {/* Calculation Parameters & Standard Loads */}
        <div className="bg-gray-800 rounded-xl p-5 text-white mb-6 shadow-inner">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 text-center">Calculation Parameters & Reference Loads</h4>
          
          <div className="grid grid-cols-4 gap-4 mb-5 pb-4 border-b border-gray-700">
            <div className="col-span-1">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Computation Method</p>
              <p className="text-sm font-bold">{calculationMethod}</p>
            </div>
            {esalType === 'simplified' ? (
              <div className="col-span-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Load Exponent (c)</p>
                <p className="text-sm font-bold">{config.loadEquivalencyExponent}</p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Serviceability (pt)</p>
                  <p className="text-sm font-bold">{config.ptVal}</p>
                </div>
                <div>
                  {pavementType === 'flexible' ? (
                    <>
                      <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Structural Node (SN)</p>
                      <p className="text-sm font-bold">{config.snVal}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Slab Thickness (D)</p>
                      <p className="text-sm font-bold">{config.dVal}</p>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Single Axle Standard</p>
              <p className="text-base font-black text-blue-300">
                {config.standardAxleLoads.single[config.unit || 'kg']} <span className="text-[10px] uppercase">{config.unit || 'kg'}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Tandem Axle Standard</p>
              <p className="text-base font-black text-blue-300">
                {config.standardAxleLoads.tandem[config.unit || 'kg']} <span className="text-[10px] uppercase">{config.unit || 'kg'}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Tridem Axle Standard</p>
              <p className="text-base font-black text-blue-300">
                {config.standardAxleLoads.tridem[config.unit || 'kg']} <span className="text-[10px] uppercase">{config.unit || 'kg'}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Quad Axle Standard</p>
              <p className="text-base font-black text-blue-300">
                {config.standardAxleLoads.quad[config.unit || 'kg']} <span className="text-[10px] uppercase">{config.unit || 'kg'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Results Table — kept on the same page */}
        <div>
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Calculated ESAL Factors</h4>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Axle Type</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-right">Average ESAL Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((result, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 text-sm font-bold text-gray-800">{result.axleType}</td>
                    <td className="px-6 py-3 text-sm font-black text-blue-700 text-right font-mono">
                      {result.averageESAL.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageWrapper>

      {/* ═══════════ PAGES 2+: Vehicle Classification Reference ═══════════ */}
      {vehicleBatches.map((batch, batchIdx) => (
        <PageWrapper
          key={batchIdx}
          reportDate={formData.date}
          pageNumber={batchIdx + 2}
          totalPages={totalPages}
        >
          <ReportHeader
            reportTitle="VEHICLE CLASSIFICATION REFERENCE"
            reportSubtitle="Standardized Vehicle Classes & Parameters"
          />

          <div className="grid grid-cols-1 gap-2 mt-4">
            {batch.map((v, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-3">
                {/* Row 1: Name, code badge, description */}
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="text-xs font-black text-gray-900">{v.name}</h5>
                  <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">{v.code}</span>
                  <span className="text-[10px] text-gray-500 font-medium ml-auto">
                    {v.axles} Axles • {v.description}
                  </span>
                </div>
                {/* Row 2: Configuration diagrams */}
                <div className="flex items-center gap-4 flex-wrap">
                  {v.configurations.map((cfg, ci) => (
                    <div key={ci} className="flex items-center gap-1.5 bg-white rounded border border-gray-100 px-2 py-1">
                      <ConfigurationDiagram config={cfg} width={80} height={22} />
                      <span className="text-[9px] font-mono font-bold text-gray-600">{cfg}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PageWrapper>
      ))}
    </div>
  );
};

export default ESALFactorReportTemplate;
