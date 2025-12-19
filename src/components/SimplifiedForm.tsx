import React, { useState } from 'react';
import { NumberInput } from './ui/NumberInput';
import { motion } from 'framer-motion';

interface SimplifiedFormProps {
  onCalculate: (result: number, inputs: any) => void;
}

export function SimplifiedForm({ onCalculate }: SimplifiedFormProps) {
  const [axleLoad, setAxleLoad] = useState('');
  const [loadExponent, setLoadExponent] = useState('4');
  const [unit, setUnit] = useState('kN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const Lx = parseFloat(axleLoad);
    const c = parseFloat(loadExponent);
    const standardLoad = unit === 'kN' ? 80 : unit === 'kg' ? 8164 : 18; // Default to 18 if unit is 'kip'

    if (isNaN(Lx) || isNaN(c)) return;

    const result = Math.pow(Lx / standardLoad, c);

    onCalculate(result, {
      axleLoad: Lx,
      loadExponent: c,
      standardLoad,
      unit
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Parameters</h3>

        {/* Unit Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Unit System</label>
          <div className="flex gap-2">
            {['kN', 'kip', 'kg'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`
                  flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all
                  ${unit === u
                    ? 'bg-gray-900 text-white shadow-md scale-[1.02]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <NumberInput
            label="Axle Load (Lx)"
            value={axleLoad}
            onChange={(e) => setAxleLoad(e.target.value)}
            placeholder="e.g. 100"
            suffix={unit}
            tooltip="The load of the axle you want to evaluate."
            required
            autoFocus
          />

          <NumberInput
            label="Load Exponent (c)"
            value={loadExponent}
            onChange={(e) => setLoadExponent(e.target.value)}
            placeholder="Typically 4"
            tooltip="Exponent typically ranges from 3.8 to 4.2. Default is 4."
            required
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all duration-200"
      >
        Calculate Impact Factor
      </motion.button>
    </form>
  );
}