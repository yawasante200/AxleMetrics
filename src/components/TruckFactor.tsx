import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Papa from 'papaparse'; // Import PapaParse for CSV parsing

function TruckFactor({ onBackToApp }: { onBackToApp: () => void }) {
  const [selectedOption, setSelectedOption] = useState<'createAxleData' | 'importAxleData' | null>(null);
  const [pavementType, setPavementType] = useState<'flexible' | 'rigid' | null>(null);
  const [calculationType, setCalculationType] = useState<'simplified' | 'aasho' | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]); // State to hold parsed CSV data

  const handleBack = () => {
    if (csvData.length > 0) {
      setCsvData([]); // Clear the uploaded CSV data
    } else if (calculationType) {
      setCalculationType(null); // Go back to calculation type selection
    } else if (pavementType) {
      setPavementType(null); // Go back to pavement type selection
    } else if (selectedOption) {
      setSelectedOption(null); // Go back to the landing page
    } else {
      onBackToApp(); // Return to the main App.tsx
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data); // Store the parsed data in state
        },
        header: true, // Optional: If the CSV file has headers
      });
    }
  };

  // Shared button class styles
  const buttonClass = "p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 group";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {!selectedOption ? (
        <div className="max-w-2xl mx-auto pt-20 px-4">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">Choose an Option</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setSelectedOption('createAxleData')}
              className={buttonClass}
            >
              <h3 className="text-xl font-medium text-gray-800">Create Axle Load Data</h3>
              <p className="text-gray-600">Manually input axle load data</p>
            </button>
            <button
              onClick={() => setSelectedOption('importAxleData')}
              className={buttonClass}
            >
              <h3 className="text-xl font-medium text-gray-800">Import Axle Load Data</h3>
              <p className="text-gray-600">Import axle data from a CSV file</p>
            </button>
          </div>
        </div>
      ) : selectedOption === 'importAxleData' ? (
        pavementType ? (
          calculationType ? (
            <div className="max-w-2xl mx-auto pt-20 px-4">
              <div className="flex items-center mb-8">
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">Upload CSV File</h2>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="p-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 w-full"
              />
              {csvData.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Uploaded Data:</h3>
                  <pre>{JSON.stringify(csvData, null, 2)}</pre>
                  <button className="mt-4 p-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600">
                    Calculate
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto pt-20 px-4">
              <div className="flex items-center mb-8">
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">Select Calculation Type</h2>
              </div>
              <div className="grid gap-4">
                <button
                  onClick={() => setCalculationType('simplified')}
                  className={buttonClass}
                >
                  Simplified Method
                </button>
                <button
                  onClick={() => setCalculationType('aasho')}
                  className={buttonClass}
                >
                  AASHTO Method
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="max-w-2xl mx-auto pt-20 px-4">
            <div className="flex items-center mb-8">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">Select Pavement Type</h2>
            </div>
            <div className="grid gap-4">
              <button
                onClick={() => setPavementType('flexible')}
                className={buttonClass}
              >
                Flexible Pavement
              </button>
              <button
                onClick={() => setPavementType('rigid')}
                className={buttonClass}
              >
                Rigid Pavement
              </button>
            </div>
          </div>
        )
      ) : selectedOption === 'createAxleData' ? (
        <div className="max-w-2xl mx-auto pt-20 px-4">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">Create Axle Load Data</h2>
          </div>
          
          <a
            href="/Axle_Data_Template_Config.xlsx"
            download
            className={buttonClass}
          >
            Download Template
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default TruckFactor;
