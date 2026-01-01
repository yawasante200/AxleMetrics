import React from 'react';

interface AADTValidationWarningProps {
  totalPercentage: number;
  className?: string;
}

/**
 * Warning component displayed when AADT percentages don't sum to 100%
 */
const AADTValidationWarning: React.FC<AADTValidationWarningProps> = ({ 
  totalPercentage, 
  className = '' 
}) => {
  // Only show if not exactly 100%
  if (Math.abs(totalPercentage - 100) < 0.01) {
    return null;
  }

  return (
    <div 
      className={`bg-amber-50 border border-amber-300 rounded-lg p-3 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
        <div>
          <p className="text-sm font-medium text-amber-800">
            Warning: AADT percentages do not sum to 100%
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Current total: {totalPercentage.toFixed(1)}%. Please verify your traffic distribution data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AADTValidationWarning;
