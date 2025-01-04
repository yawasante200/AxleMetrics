import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface AashoFormProps {
  onCalculate: (result: number) => void;
  pavementType: 'flexible' | 'rigid';
}

export function AashoForm({ onCalculate, pavementType }: AashoFormProps) {
  const [Lx, setLx] = useState('');
  const [L2, setL2] = useState('');
  const [pt, setPt] = useState('');
  const [SN, setSN] = useState('');
  const [D, setD] = useState(''); // Additional field for rigid pavements
  const [EALF, setEALF] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const lx = parseFloat(Lx);
    const l2 = parseFloat(L2);
    const ptVal = parseFloat(pt);
    const snVal = parseFloat(SN);
    const dVal = pavementType === 'rigid' ? parseFloat(D) : null;

    if (
      isNaN(lx) || isNaN(l2) || isNaN(ptVal) ||
      isNaN(snVal) || lx <= 0 || l2 <= 0 || ptVal <= 0 || snVal <= 0 ||
      (pavementType === 'rigid' && (isNaN(dVal!) || dVal! <= 0))
    ) {
      alert('Please provide valid positive values for all fields.');
      return;
    }

    let calculatedEALF = 0;

    if (pavementType === 'flexible') {
      // Flexible pavement calculations
      const Gt = Math.log10((4.2 - ptVal) / (4.2 - 1.5));
      const betaX = 0.40 + (0.081 * Math.pow(lx + l2, 3.23)) / (Math.pow(snVal + 1, 5.19) * Math.pow(l2, 3.23));
      const beta18 = 0.40 + (0.081 * Math.pow(18 + l2, 3.23)) / (Math.pow(snVal + 1, 5.19) * Math.pow(l2, 3.23));
      const logRatio = 6.1252 - 4.79 * Math.log10(lx + l2) + 4.33 * Math.log10(l2) + Gt * (betaX - beta18);
      const WtRatio = Math.pow(10, logRatio);
      calculatedEALF = 1 / WtRatio;
    } else if (pavementType === 'rigid') {
      // Rigid pavement calculations
      const Gt = Math.log10((4.5 - ptVal) / (4.5 - 1.5));
      const betaX = 1.0 + (3.63 * Math.pow(lx + l2, 5.20)) / (Math.pow(dVal! + 1, 8.46) * Math.pow(l2, 3.52));
      const beta18 = 1.0 + (3.63 * Math.pow(18 + l2, 5.20)) / (Math.pow(dVal! + 1, 8.46) * Math.pow(l2, 3.52));
      const logRatio = 5.908 - 4.62 * Math.log10(lx + l2) + 3.28 * Math.log10(l2) + Gt * (betaX - beta18);
      const WtRatio = Math.pow(10, logRatio);
      calculatedEALF = 1 / WtRatio;
    }

    // Set the calculated result
    setEALF(calculatedEALF);
    onCalculate(calculatedEALF);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="Lx" className="block text-sm font-medium text-gray-700">
          Desired Axle Load (Lx)
        </label>
        <input
          type="number"
          id="Lx"
          value={Lx}
          onChange={(e) => setLx(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="relative">
        <label htmlFor="L2" className="block text-sm font-medium text-gray-700">
          Axle Type (L2)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="L2"
            value={L2}
            onChange={(e) => setL2(e.target.value)}
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              title="Single axles = 1, tandem axles = 2, etc."
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="pt" className="block text-sm font-medium text-gray-700">
          Terminal Serviceability Index (Pt)
        </label>
        <input
          type="number"
          id="pt"
          value={pt}
          onChange={(e) => setPt(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="SN" className="block text-sm font-medium text-gray-700">
          Structural Number (SN)
        </label>
        <input
          type="number"
          id="SN"
          value={SN}
          onChange={(e) => setSN(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {pavementType === 'rigid' && (
        <div>
          <label htmlFor="D" className="block text-sm font-medium text-gray-700">
            Slab Thickness (D)
          </label>
          <input
            type="number"
            id="D"
            value={D}
            onChange={(e) => setD(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate EALF
      </button>

      {EALF !== null && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          <strong>Calculated EALF:</strong> {EALF.toFixed(4)}
        </div>
      )}
    </form>
  );
}
