import React, { useState } from 'react';
import { ArrowLeft, Download, Info } from 'lucide-react';
import { SimplifiedForm } from './SimplifiedForm';
import { AashoForm } from './AashoForm';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

interface MainCalculatorProps {
  pavementType: 'flexible' | 'rigid';
  calculationType: 'simplified' | 'aasho';
  onReset: () => void;
}

export function MainCalculator({ pavementType, calculationType, onReset }: MainCalculatorProps) {
  const [result, setResult] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<any>(null); // Store input details for PDF generation

  const handleCalculate = (value: number, inputs?: any) => {
    setResult(value);
    setInputValues(inputs); // Capture inputs for detailed PDF generation
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

      // Steps
      if (calculationType === 'simplified') {
        page.drawText('Step 1: Formula', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 20;
        page.drawText('EALF = (Axle Load / Standard Load) ^ Load Exponent', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 30;

        page.drawText('Step 2: Substitute Values', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 20;
        page.drawText(
          `EALF = (${inputValues.axleLoad} / ${inputValues.standardLoad}) ^ ${inputValues.loadExponent}`,
          { x: 50, y: yPosition, size: fontSize, font: font }
        );
        yPosition -= 30;

        page.drawText('Step 3: Perform Calculation', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 20;
        page.drawText(`EALF = ${result.toFixed(4)}`, { x: 50, y: yPosition, size: fontSize, font: font });
        
      } else if (calculationType === 'aasho') {
        page.drawText('Step 1: Calculate Gt', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 20;
        page.drawText('Gt = log10((4.2 - Pt) / (4.2 - 1.5))', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 30;

        page.drawText('Step 2: Calculate βx and β18', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 20;
        page.drawText('Substitute values into formulas for βx and β18', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 30;

        page.drawText('Step 3: Calculate log(Wtx/Wt18)', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 20;
        page.drawText(`log(Wtx/Wt18) = ${inputValues.logRatio}`, { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 30;

        page.drawText('Step 4: Calculate Wtx/Wt18 and EALF', { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 20;
        page.drawText(`Wtx/Wt18 = ${inputValues.wtRatio}`, { x: 50, y: yPosition, size: fontSize, font: font });
        yPosition -= 20;
        page.drawText(`EALF = 1 / Wtx/Wt18 = ${result.toFixed(4)}`, { x: 50, y: yPosition, size: fontSize, font: font });
      }

      const pdfBytes = await pdfDoc.save();
      const filename =
        calculationType === 'simplified' ? 'simplified_ealf_calculation.pdf' : 'aasho_ealf_calculation.pdf';
      saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      {/* Back Button */}
      <button onClick={handleReset} className="flex items-center text-blue-600 hover:text-blue-700 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Selection
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {calculationType === 'simplified' ? 'Simplified EALF Calculator' : 'AASHO EALF Calculator'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={generatePDF}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              title="Download Results"
            >
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50" title="Help">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Selection */}
        <div>
          {calculationType === 'simplified' ? (
            <SimplifiedForm onCalculate={handleCalculate} />
          ) : (
            <AashoForm onCalculate={handleCalculate} pavementType={pavementType} />
          )}
        </div>

        {/* Show Result */}
        {result !== null && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Result</h3>
            <p className="text-2xl font-bold text-blue-600">{result.toFixed(4)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
