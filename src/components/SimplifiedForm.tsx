import React, { useState } from 'react';

interface SimplifiedFormProps {
  onCalculate: (result: number) => void;
}

export function SimplifiedForm({ onCalculate }: SimplifiedFormProps) {
  const [axleLoad, setAxleLoad] = useState('');
  const [loadExponent, setLoadExponent] = useState('');
  const [unit, setUnit] = useState('kN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const Lx = parseFloat(axleLoad);
    const c = parseFloat(loadExponent);
    const standardLoad = unit === 'kN' ? 80 : unit === 'kg' ? 8164 : 18; // Default to 18 if unit is 'kip'
    const result = Math.pow(Lx / standardLoad, c);
    onCalculate(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="axleLoad" className="block text-sm font-medium text-gray-700">
          Axle Load (Lx)
        </label>
        <input
          type="number"
          id="axleLoad"
          value={axleLoad}
          onChange={(e) => setAxleLoad(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="loadExponent" className="block text-sm font-medium text-gray-700">
          Load Exponent (c)
        </label>
        <input
          type="number"
          id="loadExponent"
          value={loadExponent}
          onChange={(e) => setLoadExponent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
          Unit
        </label>
        <select
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="kN">kN</option>
          <option value="kip">kip</option>
          <option value="kg">kg</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate EALF
      </button>
    </form>
  );
}