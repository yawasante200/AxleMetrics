
import React from 'react';

interface ESALTypeSelectorProps {
  esalType: 'simplified' | 'AASHTO' | null;
  pavementType: 'flexible' | 'rigid' | null;
  onChange: (type: 'simplified' | 'AASHTO') => void;
}

const ESALTypeSelector: React.FC<ESALTypeSelectorProps> = ({ esalType, pavementType, onChange }) => {
  if (!pavementType) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">ESAL Type</label>
      <select
        value={esalType || ''}
        onChange={(e) => onChange(e.target.value as 'simplified' | 'AASHTO')}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select ESAL Type</option>
        {pavementType === 'flexible' && (
          <option value="simplified">Simplified AASHO Equation</option>
        )}
        <option value="AASHTO">Original AASHO Equation</option>
      </select>
    </div>
  );
};

export default ESALTypeSelector;
