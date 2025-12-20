import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import DesignEsalTable, { VehicleEsalData } from './DesignEsalTable';
import { calculateGrowthFactor, calculateRangeBasedGrowthFactor, calculateVariableYearlyGrowthFactor, createTemplateFile, convertTruckFactorDataToVehicleEsalData } from './design-esal/utils';
import VehicleDataUpload from './design-esal/VehicleDataUpload';
import GrowthRateOptions from './design-esal/GrowthRateOptions';
import DesignEsalForm from './design-esal/DesignEsalForm';
import ResultsExport from './design-esal/ResultsExport';
import VehicleDataForm from './design-esal/VehicleDataForm';
import { FormValues, TruckFactorCSVRow, GrowthRateCSVRow, GrowthRate, GrowthRateRange, GrowthRateType } from './design-esal/types';
import { CompanyDetails } from '../types/truckFactor';

interface DesignEsalProps {
  onCalculate?: (designEsal: number) => void;
  truckFactorData?: TruckFactorCSVRow[];
}

const DesignEsal: React.FC<DesignEsalProps> = ({ onCalculate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Data States
  const [vehicleData, setVehicleData] = useState<VehicleEsalData[]>([]);
  const [totalDesignEsals, setTotalDesignEsals] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [useVariableGrowthRate, setUseVariableGrowthRate] = useState<boolean>(false);
  const [growthRates, setGrowthRates] = useState<GrowthRate[]>([]);
  const [growthRateRanges, setGrowthRateRanges] = useState<GrowthRateRange[]>([]);
  const [growthRateType, setGrowthRateType] = useState<GrowthRateType>(GrowthRateType.CONSTANT);
  const [designPeriod, setDesignPeriod] = useState<number>(20);
  const [dataSource, setDataSource] = useState<'upload' | 'manual' | 'truckFactor'>('upload');

  const [formValues, setFormValues] = useState<FormValues>({
    aadt: 10000,
    growthRate: 4,
    designPeriod: 20,
    directionDistribution: 60,
    laneDistribution: 90
  });

  const [truckFactorData, setTruckFactorData] = useState<TruckFactorCSVRow[]>([]);

  // Company details state
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    company: '',
    address: '',
    phone: '',
    date: new Date().toLocaleDateString(),
    project: '',
    name: ''
  });
  const [showCompanyDialog, setShowCompanyDialog] = useState<boolean>(false);

  useEffect(() => {
    if (location.state?.truckFactorData && location.state.truckFactorData.length > 0) {
      const receivedTruckFactorData = location.state.truckFactorData;
      setTruckFactorData(receivedTruckFactorData);

      const convertedData = convertTruckFactorDataToVehicleEsalData(receivedTruckFactorData);
      setVehicleData(convertedData);
      setDataSource('truckFactor');

      if (location.state.companyDetails) {
        setCompanyDetails(location.state.companyDetails);
      }
    }
  }, [location.state]);

  const handleVehicleDataUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<TruckFactorCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validRows = results.data.filter(row => {
          return row['Vehicle Class'] && row['Percent of AADT'] && row['Truck Factor'];
        });

        if (validRows.length === 0) {
          alert("No valid data found in the CSV file. Please check the format.");
          return;
        }

        const processedData = validRows.map(row => ({
          vehicleClass: row['Vehicle Class'],
          percentOfAadt: parseFloat(String(row['Percent of AADT'])) || 0,
          truckFactor: parseFloat(String(row['Truck Factor'])) || 0,
          aadt: 0,
          directionalAadt: 0,
          designLaneAadt: 0,
          growthRate: 0,
          growthFactor: 0,
          yearlyTraffic: 0,
          designEsals: 0
        }));

        setVehicleData(processedData);
        setDataSource('upload');
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file. Please check the format.");
      }
    });
  };

  const handleGrowthRateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<GrowthRateCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validRows = results.data.filter(row => {
          return row['Year'] && row['Growth Rate (%)'];
        });

        if (validRows.length === 0) {
          alert("No valid growth rate data found in the CSV file. Please check the format.");
          return;
        }

        const rates = validRows.map(row => ({
          year: parseInt(row['Year']) || 0,
          rate: parseFloat(row['Growth Rate (%)']) || 0
        })).sort((a, b) => a.year - b.year);

        setGrowthRates(rates);
        setGrowthRateType(GrowthRateType.YEARLY);
        setUseVariableGrowthRate(true);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file. Please check the format.");
      }
    });
  };

  // STEP 1 SUBMIT -> Move to Step 2
  const onStep1Submit = (data: FormValues) => {
    setFormValues(data);
    setCurrentStep(2);
  };

  // STEP 2 SUBMIT -> Calculate and Move to Step 3
  const handleCalculate = () => {
    if (vehicleData.length === 0) {
      alert("Please provide vehicle data before calculating.");
      return;
    }

    const directionFactor = formValues.directionDistribution / 100;
    const laneFactor = formValues.laneDistribution / 100;

    // Validate Total Percentage if using Truck Factor or Manual
    const totalPercentage = vehicleData.reduce((sum, v) => sum + v.percentOfAadt, 0);
    if ((dataSource === 'manual' || dataSource === 'truckFactor') && Math.abs(totalPercentage - 100) > 0.1) {
      // Just a warning or block? Let's warn but allow.
      // alert("Warning: Total vehicle percentage is " + totalPercentage.toFixed(1) + "%. It should nominally be 100%.");
    }

    const updatedVehicleData = vehicleData.map(vehicle => {
      const vehicleAadt = (vehicle.percentOfAadt / 100) * formValues.aadt;
      const directionalAadt = vehicleAadt * directionFactor;
      const designLaneAadt = directionalAadt * laneFactor;

      let growthFactor;
      if (useVariableGrowthRate) {
        if (growthRateType === GrowthRateType.YEARLY && growthRates.length > 0) {
          growthFactor = calculateVariableYearlyGrowthFactor(growthRates, formValues.designPeriod);
        } else if (growthRateType === GrowthRateType.RANGE && growthRateRanges.length > 0) {
          growthFactor = calculateRangeBasedGrowthFactor(growthRateRanges, formValues.designPeriod);
        } else {
          growthFactor = calculateGrowthFactor(formValues.growthRate, formValues.designPeriod);
        }
      } else {
        growthFactor = calculateGrowthFactor(formValues.growthRate, formValues.designPeriod);
      }

      const yearlyTraffic = designLaneAadt * growthFactor * 365;
      const designEsals = yearlyTraffic * vehicle.truckFactor;

      return {
        ...vehicle,
        aadt: vehicleAadt,
        directionalAadt,
        designLaneAadt,
        growthRate: useVariableGrowthRate ?
          (growthRateType === GrowthRateType.YEARLY ? growthRates.map(r => r.rate) :
            growthRateType === GrowthRateType.RANGE ? growthRateRanges.map(r => r.rate) :
              formValues.growthRate) :
          formValues.growthRate,
        growthFactor,
        yearlyTraffic,
        designEsals
      };
    });

    const totalEsals = updatedVehicleData.reduce((sum, vehicle) => sum + vehicle.designEsals, 0);

    setVehicleData(updatedVehicleData);
    setTotalDesignEsals(totalEsals);
    setShowResults(true);
    setCurrentStep(3);

    if (onCalculate) {
      onCalculate(totalEsals);
    }
  };

  const handleBackToTruckFactor = () => {
    navigate('/truck-factor');
  };

  const handlePercentageChange = (index: number, value: string) => {
    const updatedVehicleData = [...vehicleData];
    updatedVehicleData[index] = {
      ...updatedVehicleData[index],
      percentOfAadt: parseFloat(value) || 0
    };
    setVehicleData(updatedVehicleData);

    if (dataSource === 'truckFactor' && truckFactorData.length > 0) {
      const updatedTruckFactorData = [...truckFactorData];
      updatedTruckFactorData[index] = {
        ...updatedTruckFactorData[index],
        'Percent of AADT': value
      };
      setTruckFactorData(updatedTruckFactorData);
    }
  };

  // Render Step Content
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
        <h3 className="font-semibold text-blue-900">Step 1: Project & Design Parameters</h3>
        <p className="text-sm text-blue-700">Define the core project details, traffic volume, and growth expectations.</p>
      </div>

      <DesignEsalForm
        onSubmit={onStep1Submit}
        useVariableGrowthRate={useVariableGrowthRate}
        onUseVariableGrowthRateChange={setUseVariableGrowthRate}
        onGrowthRateUpload={handleGrowthRateUpload}
        growthRates={growthRates}
        setGrowthRates={setGrowthRates}
        growthRateRanges={growthRateRanges}
        setGrowthRateRanges={setGrowthRateRanges}
        vehicleDataLength={vehicleData.length} // Not strictly used for disabling anymore
        growthRatesLength={growthRateType === GrowthRateType.YEARLY ? growthRates.length : growthRateRanges.length}
        setDesignPeriod={setDesignPeriod}
        growthRateType={growthRateType}
        setGrowthRateType={setGrowthRateType}
        designPeriod={designPeriod}
        defaultValues={formValues}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
        <h3 className="font-semibold text-blue-900">Step 2: Vehicle Data Analysis</h3>
        <p className="text-sm text-blue-700">Input or upload vehicle classification and truck factor data.</p>
      </div>

      {/* Data Source Selection */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Vehicle Data Source</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dataSource"
              checked={dataSource === 'upload'}
              onChange={() => setDataSource('upload')}
            />
            <span>Upload CSV</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dataSource"
              checked={dataSource === 'manual'}
              onChange={() => setDataSource('manual')}
            />
            <span>Manual Entry</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dataSource"
              checked={dataSource === 'truckFactor'}
              onChange={() => setDataSource('truckFactor')}
            />
            <span>Use Truck Factor Results</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {dataSource === 'upload' && (
          <VehicleDataUpload
            vehicleData={vehicleData}
            onVehicleDataUpload={handleVehicleDataUpload}
          />
        )}

        {dataSource === 'manual' && (
          <VehicleDataForm
            vehicleData={vehicleData}
            setVehicleData={setVehicleData}
          />
        )}

        {dataSource === 'truckFactor' && vehicleData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Truck Factor Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign the percentage of Annual Average Daily Traffic (AADT) for each vehicle class:
            </p>
            <div className="space-y-2 border rounded-md p-4">
              {vehicleData.map((vehicle, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-1/3 font-medium">{vehicle.vehicleClass}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="e.g. 15"
                        value={vehicle.percentOfAadt || ''}
                        onChange={(e) => handlePercentageChange(index, e.target.value)}
                        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                      />
                      <span className="text-gray-600">%</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span className={vehicleData.reduce((sum, v) => sum + v.percentOfAadt, 0) > 100 ? 'text-red-500 font-bold' : 'font-bold'}>
                    {vehicleData.reduce((sum, v) => sum + v.percentOfAadt, 0).toFixed(1)}%
                  </span>
                </div>
                {vehicleData.reduce((sum, v) => sum + v.percentOfAadt, 0) > 100 && (
                  <p className="text-red-500 text-xs mt-1">
                    Warning: Total exceeds 100%
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 bg-white"
        >
          Back to Parameters
        </button>
        <button
          onClick={handleCalculate}
          disabled={vehicleData.length === 0}
          className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calculate Design ESAL Results
        </button>
      </div>

    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-md border border-green-100 mb-2 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-green-900">Step 3: Calculation Results</h3>
          <p className="text-sm text-green-700">Review the calculated Design ESALs and export reports.</p>
        </div>
        <button
          onClick={() => setCurrentStep(2)}
          className="text-sm text-green-700 hover:text-green-900 font-medium underline px-3 py-1"
        >
          Edit Inputs
        </button>
      </div>

      <ResultsExport
        showResults={true}
        vehicleData={vehicleData}
        formValues={formValues}
        totalDesignEsals={totalDesignEsals}
        growthRateType={growthRateType}
        companyDetails={companyDetails}
      />

      <DesignEsalTable
        vehicleData={vehicleData}
        totalAadt={formValues.aadt}
        designPeriod={formValues.designPeriod}
        directionalDistributionFactor={formValues.directionDistribution / 100}
        laneDistributionFactor={formValues.laneDistribution / 100}
        totalDesignEsals={totalDesignEsals}
      />

      <div className="flex justify-start pt-4 border-t">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 bg-white flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Start Over (Edit Parameters)
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold">Design ESAL Calculator</h2>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center mr-4 bg-gray-100 rounded-full px-3 py-1 shrink-0">
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</span>
              <span className={`text-sm ${currentStep >= 1 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>Parameters</span>
              <div className="w-4 h-px bg-gray-300 mx-2"></div>
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</span>
              <span className={`text-sm ${currentStep >= 2 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>Vehicles</span>
              <div className="w-4 h-px bg-gray-300 mx-2"></div>
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>3</span>
              <span className={`text-sm ${currentStep >= 3 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>Results</span>
            </div>

            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2 whitespace-nowrap shrink-0"
              onClick={() => setShowCompanyDialog(true)}
            >
              Company Details
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2 flex items-center gap-1 whitespace-nowrap shrink-0"
              onClick={handleBackToTruckFactor}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Truck Factor
            </button>
          </div>
        </div>
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>

    </div>
  );
};

export default DesignEsal;
