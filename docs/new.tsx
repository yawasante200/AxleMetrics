import React, { useState } from 'react';
import Papa from 'papaparse';

const App = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [truckFactors, setTruckFactors] = useState<any[]>([]);

  const calculateTruckFactors = (data: any[]) => {
    const factors = data.map((row: any) => {
      return row.map((axle: number) => {
        // Truck Factor calculation based on axle load (kg)
        const truckFactor = Math.pow(axle / 8164.66, 4); 
        return truckFactor;
      });
    });
    setTruckFactors(factors);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData = result.data;
          setCsvData(parsedData);
          calculateTruckFactors(parsedData);
        },
        header: false,
      });
    }
  };
  
  const exportCsv = () => {
    const exportData = truckFactors.map((row: any) => row.map((factor: number) => factor.toFixed(4)));
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'truck_factors.csv';
    link.click();
  };
  
  return (
    <div className="App">
      <h1>Truck Factor Calculator</h1>

      {/* Upload CSV */}
      <input type="file" accept=".csv" onChange={handleCsvUpload} />

      {/* Display Truck Factors */}
      {truckFactors.length > 0 && (
        <div>
          <h2>Calculated Truck Factors</h2>
          <table border="1">
            <thead>
              <tr>
                {csvData[0]?.map((_, index: number) => (
                  <th key={index}>Axle {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {truckFactors.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((factor: number, index: number) => (
                    <td key={index}>{factor.toFixed(4)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
