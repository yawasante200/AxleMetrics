import React, { useState } from 'react';
import { NumberInput } from './ui/NumberInput';
import { motion } from 'framer-motion';

interface AashoFormProps {
  onCalculate: (result: number, inputs: any) => void;
  pavementType: 'flexible' | 'rigid';
}

export function AashoForm({ onCalculate, pavementType }: AashoFormProps) {
  const [Lx, setLx] = useState('');
  const [L2, setL2] = useState('1');
  const [pt, setPt] = useState('2.5');
  const [SN, setSN] = useState('');
  const [D, setD] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    const lx = parseFloat(Lx);
    const l2 = parseFloat(L2);
    const ptVal = parseFloat(pt);
    const snVal = parseFloat(SN);
    const dVal = pavementType === 'rigid' ? parseFloat(D) : null;

    if (
      isNaN(lx) || isNaN(l2) || isNaN(ptVal) ||
      (pavementType === 'flexible' && isNaN(snVal)) ||
      (pavementType === 'rigid' && (isNaN(dVal!) || dVal! <= 0))
    ) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    let calculatedEALF = 0;
    let logRatio = 0, wtRatio = 0;

    // Use standard 18 kips for calculation reference in visualization
    // Note: AASHO equations are typically in kips/inches. Assuming user inputs consistent units or we need to handle unit conversion.
    // For this redesign, we'll assume the user inputs kips for simplicity or clarify in tooltip.
    // Ideally, we should add unit selection like SimplifiedForm.

    if (pavementType === 'flexible') {
      const Gt = Math.log10((4.2 - ptVal) / (4.2 - 1.5));
      const betaX = 0.40 + (0.081 * Math.pow(lx + l2, 3.23)) / (Math.pow(snVal + 1, 5.19) * Math.pow(l2, 3.23));
      const beta18 = 0.40 + (0.081 * Math.pow(18 + l2, 3.23)) / (Math.pow(snVal + 1, 5.19) * Math.pow(l2, 3.23));
      logRatio = 6.1252 - 4.79 * Math.log10(lx + l2) + 4.33 * Math.log10(l2) + Gt * (betaX - beta18);
      wtRatio = Math.pow(10, logRatio);
      calculatedEALF = 1 / wtRatio;
    } else if (pavementType === 'rigid') {
      const Gt = Math.log10((4.5 - ptVal) / (4.5 - 1.5));
      const betaX = 1.0 + (3.63 * Math.pow(lx + l2, 5.20)) / (Math.pow(dVal! + 1, 8.46) * Math.pow(l2, 3.52));
      const beta18 = 1.0 + (3.63 * Math.pow(18 + l2, 5.20)) / (Math.pow(dVal! + 1, 8.46) * Math.pow(l2, 3.52));
      logRatio = 5.908 - 4.62 * Math.log10(lx + l2) + 3.28 * Math.log10(l2) + Gt * (betaX - beta18);
      wtRatio = Math.pow(10, logRatio);
      calculatedEALF = 1 / wtRatio;
    }

    onCalculate(calculatedEALF, {
      axleLoad: lx,
      standardLoad: 18, // Reference 18-kip ESAL
      unit: 'kip', // Implicitly kips for AASHTO usually
      loadExponent: null,
      pt: ptVal,
      sn: snVal,
      d: dVal,
      logRatio,
      wtRatio
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AASHTO Parameters</h3>
        <p className="text-sm text-gray-500 mb-6 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
          Note: Input values should be in imperial units (kips, inches) for standard AASHTO coefficients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Axle Load (Lx)"
            value={Lx}
            onChange={(e) => setLx(e.target.value)}
            suffix="kips"
            placeholder="e.g. 18"
            required
          />

          <NumberInput
            label="Axle Type Code (L2)"
            value={L2}
            onChange={(e) => setL2(e.target.value)}
            tooltip="1 = Single Axle, 2 = Tandem Axle, 3 = Tridem Axle"
            placeholder="1"
            required
          />

          <NumberInput
            label="Terminal Serviceability (Pt)"
            value={pt}
            onChange={(e) => setPt(e.target.value)}
            tooltip="Value at end of design life (typically 2.0 or 2.5)"
            placeholder="2.5"
            required
          />

          {pavementType === 'flexible' ? (
            <NumberInput
              label="Structural Number (SN)"
              value={SN}
              onChange={(e) => setSN(e.target.value)}
              tooltip="Index reflecting pavement structural strength"
              placeholder="e.g. 3.0"
              required
            />
          ) : (
            <NumberInput
              label="Slab Thickness (D)"
              value={D}
              onChange={(e) => setD(e.target.value)}
              suffix="inches"
              placeholder="e.g. 8"
              required
            />
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all duration-200"
      >
        Calculate AASHTO EALF
      </motion.button>
    </form>
  );
}
