
import React, { useState } from 'react';
import { ESALConfig } from '../types/config';

interface ConfigurationModalProps {
  onSubmit: (config: ESALConfig) => void;
  onClose: () => void;
  defaultConfig: ESALConfig;
  esalType: 'simplified' | 'AASHTO';
  pavementType: 'flexible' | 'rigid';
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  onSubmit,
  onClose,
  defaultConfig,
  esalType,
  pavementType,
}) => {
  const [config, setConfig] = useState<ESALConfig>(defaultConfig);
  const [unit, setUnit] = useState<'kN' | 'kips' | 'kg'>(defaultConfig.unit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...config, unit });
  };

  const handleUnitChange = (newUnit: 'kN' | 'kips' | 'kg') => {
    setUnit(newUnit);
    setConfig(prev => ({
      ...prev,
      unit: newUnit
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">ESAL Configuration</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
          {esalType === 'AASHTO' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Terminal Serviceability (Pt)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.ptVal}
                  onChange={(e) => setConfig({ ...config, ptVal: parseFloat(e.target.value) })}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              {pavementType === 'flexible' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Structural Number (SN)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.snVal}
                    onChange={(e) => setConfig({ ...config, snVal: parseFloat(e.target.value) })}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )}
              {pavementType === 'rigid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slab Thickness (D)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.dVal}
                    onChange={(e) => setConfig({ ...config, dVal: parseFloat(e.target.value) })}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </>
          )}

          {esalType === 'simplified' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Load Unit</label>
                <select
                  value={unit}
                  onChange={(e) => handleUnitChange(e.target.value as 'kN' | 'kips' | 'kg')}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="kN">kN</option>
                  <option value="kips">kips</option>
                  <option value="kg">kg</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Load Equivalency Exponent</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.loadEquivalencyExponent}
                  onChange={(e) => setConfig({ ...config, loadEquivalencyExponent: parseFloat(e.target.value) })}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Single Axle Load</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.standardAxleLoads.single[unit]}
                  onChange={(e) => setConfig({
                    ...config,
                    standardAxleLoads: {
                      ...config.standardAxleLoads,
                      single: { ...config.standardAxleLoads.single, [unit]: parseFloat(e.target.value) }
                    }
                  })}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tandem Axle Load</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.standardAxleLoads.tandem[unit]}
                  onChange={(e) => setConfig({
                    ...config,
                    standardAxleLoads: {
                      ...config.standardAxleLoads,
                      tandem: { ...config.standardAxleLoads.tandem, [unit]: parseFloat(e.target.value) }
                    }
                  })}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tridem Axle Load</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.standardAxleLoads.tridem[unit]}
                  onChange={(e) => setConfig({
                    ...config,
                    standardAxleLoads: {
                      ...config.standardAxleLoads,
                      tridem: { ...config.standardAxleLoads.tridem, [unit]: parseFloat(e.target.value) }
                    }
                  })}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationModal;
