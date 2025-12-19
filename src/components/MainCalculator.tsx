import React, { useState } from 'react';
import { ArrowLeft, Download, Info } from 'lucide-react';
import { SimplifiedForm } from './SimplifiedForm';
import { AashoForm } from './AashoForm';
import { AdvancedEALFChart } from './charts/AdvancedEALFChart';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

interface MainCalculatorProps {
  pavementType: 'flexible' | 'rigid';
  calculationType: 'simplified' | 'aasho';
  onReset: () => void;
}

export function MainCalculator({ pavementType, calculationType, onReset }: MainCalculatorProps) {
  const [result, setResult] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<any>(null);

  const handleCalculate = (value: number, inputs?: any) => {
    setResult(value);
    setInputValues(inputs);
  };

  const handleReset = () => {
    setResult(null);
    setInputValues(null);
    onReset();
  };

  const generatePDF = async () => {
    try {
      if (!result || !inputValues) {
        alert('Please perform a calculation before downloading the report.');
        return;
      }

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]); // Letter size
      const fontSize = 12;
      let yPosition = 750;

      // Load built-in Helvetica font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Header
      page.drawText(calculationType === 'simplified' ? 'Simplified EALF Calculation' : 'AASHO EALF Calculation', {
        x: 50,
        y: yPosition,
        size: 16,
        font: font,
      });
      yPosition -= 30;

      if (calculationType === 'simplified') {
        page.drawText('Step 1: Formula', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 20;
        page.drawText('EALF = (Axle Load / Standard Load) ^ Load Exponent', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 30;
        page.drawText(`EALF = ${result.toFixed(4)}`, { x: 50, y: yPosition, size: fontSize, font: font });
      } else {
        page.drawText(`EALF = ${result.toFixed(4)}`, { x: 50, y: yPosition, size: fontSize, font: font });
      }

      const pdfBytes = await pdfDoc.save();
      const filename = calculationType === 'simplified' ? 'simplified_ealf_calculation.pdf' : 'aasho_ealf_calculation.pdf';
      saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <button
            onClick={handleReset}
            className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Selection
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {calculationType === 'simplified' ? 'Simplified EALF Calculator' : 'AASHO EALF Calculator'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {calculationType === 'simplified'
              ? 'Calculate equivalent axle load factor using the 4th power law'
              : 'Detailed analysis using AASHO road test equations'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {calculationType === 'simplified' ? (
              <SimplifiedForm onCalculate={handleCalculate} />
            ) : (
              <AashoForm onCalculate={handleCalculate} pavementType={pavementType} />
            )}
          </div>
        </div>

        {/* Right Column: Advanced Visualization & Result */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col items-center justify-center min-h-[420px]">
            <AdvancedEALFChart
              axleLoad={inputValues?.axleLoad || 0}
              standardLoad={inputValues?.standardLoad || 0}
              result={result}
              unit={inputValues?.unit || 'kN'}
              loadExponent={inputValues?.loadExponent}
              pt={inputValues?.pt}
              sn={inputValues?.sn}
              d={inputValues?.d}
              pavementType={pavementType}
              calculationType={calculationType}
            />
          </div>

          {result !== null && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl transform transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-blue-100 font-medium text-sm uppercase tracking-wider">Calculated EALF</h4>
                <div className="bg-white/20 px-2 py-1 rounded text-xs">Impact Factor</div>
              </div>
              <div className="text-5xl font-bold mb-2 tracking-tight">{result.toFixed(4)}</div>
              <p className="text-blue-100 text-sm opacity-90 border-t border-white/20 pt-3 mt-1">
                1 Axle Pass ≈ <strong>{result.toFixed(2)}</strong> Standard Axle Passes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
