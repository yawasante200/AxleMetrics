import React from 'react';

interface ReportHeaderProps {
  reportTitle: string;
  reportSubtitle?: string;
  logoSrc?: string;
  className?: string;
}

/**
 * Reusable header for all PDF report pages.
 * Displays logo on the left and report title centered.
 * Date has been moved to the footer.
 */
const ReportHeader: React.FC<ReportHeaderProps> = ({
  reportTitle,
  reportSubtitle,
  logoSrc = '/Axle-logo.png',
  className = ''
}) => {
  return (
    <div className={className}>
      {/* Logo Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-gray-800">
        <div className="flex items-center">
          <img 
            src={logoSrc} 
            alt="AxleMetrics Logo" 
            className="h-12 w-auto object-contain flex-shrink-0"
          />
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
    </div>
  );
};

export default ReportHeader;
