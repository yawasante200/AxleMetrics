import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './logo.png'; // Ensure you have a logo image in your project

interface Result {
  axleName: string;
  configuration: string;
  combinedLoads: number[];
  ealfFlexible: number;
  ealfRigid: number;
}

interface TruckFactorProps {
  onBack: () => void;
  onProceed: (pavementType: 'flexible' | 'rigid', action: 'create' | 'import') => void;
  downloadExcelTemplate: () => void;
}

const TruckFactor: React.FC<TruckFactorProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);

  const handleCreateAxleDataFile = (): void => {
    const templateData = 'Axle Type,Configuration,Axle 1,Axle 2,Axle 3,Axle 4,Axle 5,Axle 6,Axle 7,Axle 8,Axle 9\n';
    const blob = new Blob([templateData], { type: 'text/csv' });
    saveAs(blob, 'AxleDataTemplate.csv');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const uploadedFile = event.target.files?.[0] || null;
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        processCSVData(content);
      };
      reader.readAsText(uploadedFile);
      setFile(uploadedFile);
    }
  };

  const processCSVData = (data: string): void => {
    const rows = data.split('\n').slice(1); // Skip header row
    const processedResults: Result[] = [];

    rows.forEach((row) => {
      const columns = row.split(',');
      const axleName = columns[0];
      const configuration = columns[1];
      const axleLoads = columns.slice(2).map(load => parseFloat(load)).filter(load => !isNaN(load));

      // Example calculations for EALF (replace with actual calculations)
      const ealfFlexible = axleLoads.reduce((sum, load) => sum + load * 0.0001, 0);
      const ealfRigid = axleLoads.reduce((sum, load) => sum + load * 0.0002, 0);

      processedResults.push({
        axleName,
        configuration,
        combinedLoads: axleLoads,
        ealfFlexible,
        ealfRigid,
      });
    });

    setResults(processedResults);
    generatePDF(processedResults);
  };

  const generatePDF = (data: Result[]): void => {
    const doc = new jsPDF() as jsPDF & { autoTable: (options: any) => void };
    if (!data || data.length === 0) {
      alert("No data available to generate PDF.");
      return;
    }

    // Add logo and date
    const date = new Date().toLocaleDateString();
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);
    doc.text(`Date: ${date}`, 160, 20);

    doc.text('ESAL Factor Calculation Results', 10, 40);

    try {
      doc.autoTable({
        head: [['Axle Name', 'Configuration', 'Combined Loads (Kips)', 'EALF Flexible', 'EALF Rigid']],
        body: data.map((row) => [
          row.axleName,
          row.configuration,
          row.combinedLoads.join(', '),
          row.ealfFlexible.toFixed(4),
          row.ealfRigid.toFixed(4),
        ]),
        startY: 50,
      });
      doc.save('Results.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Truck Factor Calculation</h1>
      <h2 style={{ textAlign: 'center', color: '#555' }}>ESAL Factor Calculator</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
        <button onClick={handleCreateAxleDataFile} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Create Axle Data File
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
      </div>
      {results && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ textAlign: 'center', color: '#444' }}>Results:</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Axle Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Configuration</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Combined Loads (Kips)</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>EALF Flexible</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>EALF Rigid</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} style={{ textAlign: 'center' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.axleName}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.configuration}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.combinedLoads.join(', ')}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.ealfFlexible.toFixed(4)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{result.ealfRigid.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TruckFactor;