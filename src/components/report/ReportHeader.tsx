import React from 'react';
import { ReportMetadata } from '../design-esal/types';

interface ReportHeaderProps {
  metadata?: ReportMetadata;
  reportTitle: string;
  reportSubtitle?: string;
  reportDate?: string;
  logoSrc?: string;
  className?: string;
}

/**
 * Reusable header component for all PDF reports
 * Displays logo, report title, project metadata, and date
 */
const ReportHeader: React.FC<ReportHeaderProps> = ({
  metadata,
  reportTitle,
  reportSubtitle,
  reportDate,
  logoSrc = '/Axle-logo.png',
  className = ''
}) => {
  const displayDate = reportDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={className}>
      {/* Logo and Date Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-gray-800">
        <div className="flex items-center">
          <img 
            src={logoSrc} 
            alt="AxleMetrics Logo" 
            className="h-12 w-auto object-contain flex-shrink-0"
          />
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Report Date</p>
          <p className="text-lg font-bold text-gray-900">{displayDate}</p>
        </div>
      </div>

      {/* Report Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide mb-1">
          {reportTitle}
        </h2>
        {reportSubtitle && (
          <h3 className="text-lg font-semibold text-gray-700">
            {reportSubtitle}
          </h3>
        )}
      </div>

      {/* Project Metadata (if provided) */}
      {metadata && (
        <div className="bg-blue-50 rounded-lg p-4 mb-5 border border-blue-200">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 pb-2 border-b border-blue-300">
            Project Information
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Project Location</p>
              <p className="text-sm font-semibold text-gray-900">{metadata.projectLocation || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Project Length</p>
              <p className="text-sm font-semibold text-gray-900">
                {metadata.projectLength ? `${metadata.projectLength} ${metadata.projectLengthUnit}` : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Analyst/Designer</p>
              <p className="text-sm font-semibold text-gray-900">{metadata.analystName || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportHeader;
