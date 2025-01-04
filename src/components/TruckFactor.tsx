import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState<Result[]>([]);

  // Function to create and download Excel template
  const handleCreateAxleDataFile = () => {
    const templateData = 'Axle Load,Repetitions\n';
    const blob = new Blob([templateData], { type: 'text/csv' });
    saveAs(blob, 'AxleDataTemplate.csv');
  };

  // Function to handle file upload and processing
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        processCSVData(content);
      };
      reader.readAsText(uploadedFile);
    }
  };

  // Function to process CSV data and generate results
  interface Result {
    axleLoad: number;
    repetitions: number;
  }

  const processCSVData = (data: string) => {
    const rows = data.split('\n').slice(1); // Skip header row
    const processedResults: Result[] = rows.map((row) => {
      const [axleLoad, repetitions] = row.split(',');
      return {
        axleLoad: parseFloat(axleLoad),
        repetitions: parseInt(repetitions, 10),
      };
    });
    setResults(processedResults);
    generatePDF(processedResults);
  };

  // Function to generate PDF from results
  interface PDFData {
    axleLoad: number;
    repetitions: number;
  }

  const generatePDF = (data: PDFData[]) => {
    const doc = new jsPDF();
    doc.text('ESAL Factor Calculation Results', 10, 10);
    autoTable(doc, {
      head: [['Axle Load', 'Repetitions']],
      body: data.map((row) => [row.axleLoad, row.repetitions]),
    });
    doc.save('Results.pdf');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Truck Factor Calculation</h1>
      <h2>ESAL Factor Calculator</h2>
      <div style={{ margin: '20px 0' }}>
        <button onClick={handleCreateAxleDataFile} style={{ marginRight: '10px', padding: '10px 20px' }}>
          Create Axle Data File
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: 'inline-block', padding: '10px' }}
        />
        <button
          onClick={() => file && processCSVData(file)}
          style={{ marginLeft: '10px', padding: '10px 20px' }}
        >
          Process CSV
        </button>
      </div>
      {results && (
        <div>
          <h3>Results:</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                Axle Load: {result.axleLoad}, Repetitions: {result.repetitions}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
