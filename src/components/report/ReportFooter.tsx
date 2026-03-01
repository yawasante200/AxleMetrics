import React from 'react';

interface ReportFooterProps {
  reportDate?: string;
  pageNumber?: number;
  totalPages?: number;
  className?: string;
}

/**
 * Reusable footer for all PDF report pages.
 * Shows: Report Date (left) | © 2026 AxleMetrics (center) | Page X of Y (right)
 */
const ReportFooter: React.FC<ReportFooterProps> = ({
  reportDate,
  pageNumber,
  totalPages,
  className = ''
}) => {
  const displayDate = reportDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`pt-4 border-t border-gray-300 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-gray-500">
          Report Date: {displayDate}
        </p>
        <p className="text-[10px] text-gray-600 font-medium">
          © 2026 AxleMetrics
        </p>
        {pageNumber && totalPages ? (
          <p className="text-[10px] text-gray-500">
            Page {pageNumber} of {totalPages}
          </p>
        ) : (
          <p className="text-[10px] text-gray-500">&nbsp;</p>
        )}
      </div>
    </div>
  );
};

export default ReportFooter;
