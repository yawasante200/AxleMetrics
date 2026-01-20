import React from 'react';

interface ReportFooterProps {
  className?: string;
}

/**
 * Reusable footer component for all PDF reports
 * Displays copyright (© 2026 AxleMetrics) and AASHTO methodology note
 */
const ReportFooter: React.FC<ReportFooterProps> = ({ className = '' }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`pt-6 border-t border-gray-300 ${className}`}>
      <div className="text-center space-y-1">
        <p className="text-xs text-gray-500">
          Report Generated: {currentDate}
        </p>
        <p className="text-xs text-gray-600 font-medium">
          © 2026 AxleMetrics
        </p>
        <p className="text-xs text-gray-500">
          This report is generated based on AASHTO methods
        </p>
      </div>
    </div>
  );
};

export default ReportFooter;
