import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { TruckFactorProps, Result, CompanyDetails } from '../types/truckFactor';
import { CONSTANTS, calculateAASHTOEALF, calculateSimplifiedEALF, processConfiguration, interpretAxleType, getDefaultConfig } from '../utils/esalCalculations';
import { generatePDF } from '../utils/pdfGenerator';
import { getVehicleClassification } from '../utils/classificationUtils';
import ResultsTable from './ResultsTable';
import FormModal from './FormModal';
import PavementTypeSelector from './PavementTypeSelector';
import ESALTypeSelector from './ESALTypeSelector';
import FileUploadSection, { FileUploadSectionRef } from './FileUploadSection';
import ConfigurationModal from './ConfigurationModal';
import { ESALConfig } from '../types/config';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const TruckFactor: React.FC<TruckFactorProps> = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const [pavementType, setPavementType] = useState<'flexible' | 'rigid' | null>(null);
  const [esalType, setEsalType] = useState<'simplified' | 'AASHTO' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [config, setConfig] = useState<ESALConfig>(getDefaultConfig());
  const [formData, setFormData] = useState<CompanyDetails | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileUploadSectionRef = useRef<FileUploadSectionRef>(null);

  const handleCreateAxleDataFile = (): void => {
    const fileUrl = '/Axle Data Template.xlsx';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'Axle Data Template.xlsx';
    link.click();
  };
  const handleProceedToDesignEsal = () => {
    if (!results || results.length === 0) return;
    
    const truckFactorData = results.map(result => ({
      'Vehicle Class': result.axleType,
      'Percent of AADT': '',
      'Truck Factor': result.averageESAL
    }));
    navigate('/design-esal', { state: { truckFactorData } });
  };
  const handleUploadClick = () => {
    if (!pavementType || !esalType) {
      alert('Please select Pavement Type and Calculation Type (ESAL Type) before uploading a file.');
      return;
    }
    setShowFormModal(true);
  };

  const handleFormSubmit = (data: CompanyDetails) => {
    setFormData(data);
    setShowFormModal(false);
    
    // Trigger file input click immediately after form submission
    setTimeout(() => {
      if (fileUploadSectionRef.current) {
        fileUploadSectionRef.current.triggerFileInput();
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

  const handleConfigSubmit = (newConfig: ESALConfig) => {
    setConfig(newConfig);
    setShowConfigModal(false);
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

          const validRows = rows.filter(row => {
            const axleLoads = Array.from({ length: 9 }, (_, idx) =>
              parseFloat(row[`Axle ${idx + 1}`]) || 0
            );
            return axleLoads.some(load => load > 0);
          });

          const processedResults: Result[] = [];
          const axleTypeGroups: { [key: string]: { esals: number[]; configs: string[] } } = {};

          validRows.forEach((row) => {
            const typedRow = row as CSVRow;
            const configStr = typedRow['Configuration'];
            const axleConfiguration = configStr
              .split(',')
              .map((num) => parseInt(num.trim()))
              .filter((num) => !isNaN(num) && num > 0);

            const code = typedRow['Truck Type'].trim();
            // Use the new utility function to get a more dynamic classification
            const axleType = getVehicleClassification(code);

            const axleLoads = Array.from({ length: 9 }, (_, idx) => {
              const loadInKg = parseFloat(typedRow[`Axle ${idx + 1}`]) || 0;
              if (esalType === 'simplified') {
                if (config.unit === 'kN') {
                  return loadInKg * CONSTANTS.KG_TO_KN; // Convert kg to kN
                } else if (config.unit === 'kips') {
                  return loadInKg * CONSTANTS.KG_TO_KIP; // Convert kg to kips
                }
                return loadInKg; // Keep as kg
              } else {
                return loadInKg; // Keep as kg, conversion will happen in calculateAASHTOEALF
              }
            });

            const combinedLoads = processConfiguration(axleConfiguration, axleLoads, esalType || 'AASHTO');
            const axleTypes = interpretAxleType(axleConfiguration);
            let esal = 0;

            if (esalType === 'simplified') {
              combinedLoads.forEach((load, idx) => {
                esal += calculateSimplifiedEALF(load, axleTypes[idx], config);
              });
            } else {
              combinedLoads.forEach((load, idx) => {
                esal += calculateAASHTOEALF(load, axleTypes[idx], pavementType || 'flexible', config);
              });
            }

            // Extract base axle type for grouping, removing version numbers (e.g., T1, T2)
            // Now handled by the getVehicleClassification function
            
            if (!axleTypeGroups[axleType]) {
              axleTypeGroups[axleType] = { esals: [], configs: [] };
            }
            axleTypeGroups[axleType].esals.push(esal);
            axleTypeGroups[axleType].configs.push(configStr);
          });

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
            generatePDF(processedResults, formData, esalType || 'AASHTO', pavementType || 'flexible', config);
          }
        },
      });
    } catch (error) {
      console.error('Error processing CSV:', error);
      alert('Error processing CSV file.');
    }
  };

  const handlePavementTypeChange = (type: 'flexible' | 'rigid') => {
    setPavementType(type);
    setResults(null);
    if (type === 'rigid') {
      setEsalType('AASHTO');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEsalTypeChange = (type: 'simplified' | 'AASHTO') => {
    setEsalType(type);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">ESAL Factor Calculator</h1>

        <div className="space-y-6">
          <PavementTypeSelector
            pavementType={pavementType}
            onChange={handlePavementTypeChange}
          />

          {pavementType && (
            <ESALTypeSelector
              esalType={esalType}
              pavementType={pavementType}
              onChange={handleEsalTypeChange}
            />
          )}

          <button
            onClick={() => setShowConfigModal(true)}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Select ESAL Parameters
          </button>

          <FileUploadSection
            ref={fileUploadSectionRef}
            onCreateTemplate={handleCreateAxleDataFile}
            onUploadClick={handleUploadClick}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>

      {isProcessing && <div className="text-center text-blue-500">Processing...</div>}

      {results && results.length > 0 && (
        <div className="space-y-4">
          <ResultsTable results={results} />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleProceedToDesignEsal}
              className="inline-flex items-center justify-center gap-2"
            >
              Proceed to Design ESAL
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showFormModal && (
        <FormModal
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
        />
      )}

      {showConfigModal && (
        <ConfigurationModal
          onSubmit={handleConfigSubmit}
          onClose={() => setShowConfigModal(false)}
          defaultConfig={config}
          esalType={esalType || 'AASHTO'}
          pavementType={pavementType || 'flexible'}
        />
      )}
    </div>
  );
};

export default TruckFactor;
