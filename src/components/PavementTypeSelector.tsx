
import React from 'react';

interface PavementTypeSelectorProps {
  pavementType: 'flexible' | 'rigid' | null;
  onChange: (type: 'flexible' | 'rigid') => void;
}

const PavementTypeSelector: React.FC<PavementTypeSelectorProps> = ({ pavementType, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Pavement Type</label>
      <select
        value={pavementType || ''}
        onChange={(e) => onChange(e.target.value as 'flexible' | 'rigid')}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Pavement Type</option>
        <option value="flexible">Flexible Pavement</option>
        <option value="rigid">Rigid Pavement</option>
      </select>
    </div>
  );
};

export default PavementTypeSelector;
