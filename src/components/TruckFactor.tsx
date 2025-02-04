import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { TruckFactorProps, Result, CompanyDetails } from '../types/truckFactor';
import { CONSTANTS, calculateAASHTOEALF, calculateSimplifiedEALF, processConfiguration, interpretAxleType } from '../utils/esalCalculations';
import { generatePDF } from '../utils/pdfGenerator';
import ResultsTable from './ResultsTable';

type CSVRow = {
  'Truck Type': string;
  'Configuration': string;
  'Axle 1': string;
  'Axle 2': string;
  'Axle 3': string;
  'Axle 4': string;
  'Axle 5': string;
  'Axle 6': string;
  'Axle 7': string;
  'Axle 8': string;
  'Axle 9': string;
  'Axle 10': string;
  [key: string]: string;
};

type FormModalProps = {
  onSubmit: (data: { company: string; address: string; phone: string; date: string; project: string; name: string }) => void;
  onClose: () => void;
};

const FormModal: React.FC<FormModalProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    company: '',
    address: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    project: '',
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };  

  return (
    <div className="modal-overlay">
      <div className='flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors cursor-pointer'>
      <div className="modal">
        <h2 className="text-xl font-bold ">Fill Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4 space-x-5 flex-2 border-gray-300">
          <input type="text" name="company" className='ml-4' placeholder="Company" value={formData.company} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input type="date" name="date" placeholder="Date" value={formData.date} onChange={handleChange} required />
          <input type="text" name="project" placeholder="Project" value={formData.project} onChange={handleChange} required />
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <button type="submit" className="btn-submit px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500w-full px-4 py-2 border  border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">Submit</button>
        </form>
        <button onClick={onClose} className="btn-close w-full mt-8 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-red-300 text-red-700  font-bold focus:border-blue-500">Cancel</button>
      </div>
      </div>
    </div>
  );
};

const TruckFactor: React.FC<TruckFactorProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const [pavementType, setPavementType] = useState<'flexible' | 'rigid' | null>(null);
  const [esalType, setEsalType] = useState<'simplified' | 'AASHTO' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState<{ company: string; address: string; phone: string; date: string; project: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateAxleDataFile = (): void => {
    const fileUrl = '/Axle_Data_Template.xlsx';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'Axle_Data_Template.xlsx';
    link.click();
  };

  const handleUploadClick = () => {
    if (!pavementType || !esalType) {
      alert('Please select Pavement Type and Calculation Type (ESAL Type) before uploading a file.');
      return;
    }
    setShowFormModal(true);
  };

  const handleFormSubmit = (data: { company: string; address: string; phone: string; date: string; project: string; name: string }) => {
    setFormData(data);
    setShowFormModal(false);
    // Trigger file input click after form submission
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 100);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const uploadedFile = event.target.files?.[0] || null;
    if (uploadedFile && formData) {
      setFile(uploadedFile);
      setIsProcessing(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        processCSVData(content);
        setIsProcessing(false);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const processCSVData = (data: string): void => {
    try {
      Papa.parse<CSVRow>(data, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const headers = result.meta.fields;
          const rows = result.data;

          const requiredColumns = ['Truck Type', 'Configuration', ...Array.from({ length: 9 }, (_, i) => `Axle ${i + 1}`)];
          const missingColumns = requiredColumns.filter((col) => !headers?.includes(col));

          if (missingColumns.length > 0) {
            alert(`CSV file is missing required columns: ${missingColumns.join(', ')}`);
            return;
          }

          // Filter out rows where all axle loads are zero or empty
          const validRows = rows.filter(row => {
            const axleLoads = Array.from({ length: 9 }, (_, idx) =>
              parseFloat(row[`Axle ${idx + 1}`]) || 0
            );
            return axleLoads.some(load => load > 0);
          });

          const processedResults: Result[] = [];
          const axleTypeGroups: { [key: string]: { esals: number[]; configs: string[] } } = {};

          // Classification Code Mapping
          const CLASSIFICATION_MAP: { [key: string]: string } = {
            "SB": "Small Buses",
            "MB": "Medium Buses",
            "LB2": "Large Buses (2-axle)",
            "LB3": "Large Buses (3-axle)",
            "LT": "Light Trucks",
            "MT1": "Medium Trucks",
            "MT2": "Medium Trucks",
            "HT5": "Heavy Trucks",
            "HT4": "Heavy Trucks",
            "3T1": "3-axle trailers",
            "3T2": "3-axle trailers",
            "4T1": "4-axle trailers",
            "4T2": "4-axle trailers",
            "5T1": "5-axle trailers",
            "5T2": "5-axle trailers",
            "5T3": "5-axle trailers",
            "6T1": "6-axle trailers",
            "6T2": "6-axle trailers",
            "7T1": "7-axle trailers",
            "7T2": "7-axle trailers",
            "7T3": "7-axle trailers",
            "8T1": "8-axle trailers",
            "8T2": "8-axle trailers",
            "9T1": "9-axle trailers",
            "9T2": "9-axle trailers",
            "10T": "10-axle trailers",
          };
  
          validRows.forEach((row) => {
            const typedRow = row as CSVRow;
            const configStr = typedRow['Configuration'];
            const config = configStr
              .split(',')
              .map((num) => parseInt(num.trim()))
              .filter((num) => !isNaN(num) && num > 0);

            const code = typedRow['Truck Type'].trim().toUpperCase();
            const axleType = CLASSIFICATION_MAP[code] || code;

            const axleLoads = Array.from({ length: 9 }, (_, idx) =>
              parseFloat(typedRow[`Axle ${idx + 1}`]) || 0
            );

            const combinedLoads = processConfiguration(config, axleLoads, esalType || 'AASHTO');
            const axleTypes = interpretAxleType(config);
            let esal = 0;

            if (pavementType === 'flexible' && esalType === 'simplified') {
              combinedLoads.forEach((load, idx) => {
                esal += calculateSimplifiedEALF(load, axleTypes[idx]);
              });
            } else {
              combinedLoads.forEach((load) => {
                const loadInKips = load * CONSTANTS.KG_TO_KIP;
                esal += calculateAASHTOEALF(loadInKips, 'Single', pavementType || 'flexible');
              });
            }

            const baseAxleType = axleType.replace(/(1|2|3|4)$/, '');

            if (!axleTypeGroups[baseAxleType]) {
              axleTypeGroups[baseAxleType] = { esals: [], configs: [] };
            }
            axleTypeGroups[baseAxleType].esals.push(esal);
            axleTypeGroups[baseAxleType].configs.push(configStr);
          });

          // Filter out groups with zero ESAL values
          Object.entries(axleTypeGroups).forEach(([axleType, data]) => {
            const avgESAL = data.esals.reduce((a, b) => a + b, 0) / data.esals.length;
            if (avgESAL > 0) {
              processedResults.push({
                axleType,
                configuration: data.configs,
                averageESAL: avgESAL,
              });
            }
          });

          setResults(processedResults);

          if (formData) {
            generatePDF(processedResults, formData);
          }
        },
      });
    } catch (error) {
      console.error('Error processing CSV:', error);
      alert('Error processing CSV file.');
    }
  };
  
  

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">ESAL Factor Calculator</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pavement Type</label>
            <select
              value={pavementType || ''}
              onChange={(e) => {
                const newPavementType = e.target.value as 'flexible' | 'rigid';
                setPavementType(newPavementType);
                // Reset ESAL type when changing pavement type
                if (newPavementType === 'rigid') {
                  setEsalType('AASHTO');
                } else {
                  setEsalType(null);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Pavement Type</option>
              <option value="flexible">Flexible Pavement</option>
              <option value="rigid">Rigid Pavement</option>
            </select>
          </div>

          {pavementType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ESAL Type</label>
              <select
                value={esalType || ''}
                onChange={(e) => setEsalType(e.target.value as 'simplified' | 'AASHTO')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select ESAL Type</option>
                {pavementType === 'flexible' && (
                  <option value="simplified">Simplified ESAL</option>
                )}
                <option value="AASHTO">AASHTO ESAL</option>
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleCreateAxleDataFile}
              className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-medium text-gray-900">Download Template</span>
              <span className="text-sm text-gray-500">Get the Excel template</span>
            </button>

            <button
              onClick={handleUploadClick}
              className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span className="text-lg font-medium text-gray-900">Upload Data</span>
              <span className="text-sm text-gray-500">Select CSV file</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {isProcessing && <div className="text-center text-blue-500">Processing...</div>}

      {results && results.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Results</h2>
          <ResultsTable results={results} />
        </div>
      )}

      {showFormModal && (
        <FormModal
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
        />
      )}
    </div>
  );
};

export default TruckFactor;