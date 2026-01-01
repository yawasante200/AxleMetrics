import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues, GrowthRate, GrowthRateRange, TruckFactorCSVRow, ESALRoundingOption, AADTValidationResult, YearlyESALData } from './types';
import * as FileSaver from 'file-saver';

export const calculateGrowthFactor = (growthRate: number, years: number): number => {
  const r = growthRate / 100;
  if (r === 0) return years;
  const result = (Math.pow(1 + r, years) - 1) / r;
  // Guard against infinity/NaN
  if (!isFinite(result) || isNaN(result)) return years;
  return result;
};

export const calculateVariableYearlyGrowthFactor = (rates: GrowthRate[], designPeriod: number, baseYear?: number): number => {
  const startYear = baseYear || new Date().getFullYear();
  let endYear = startYear + designPeriod;
  let cumulativeGrowth = 1;
  let totalTraffic = 0;

  for (let year = startYear; year < endYear; year++) {
    const applicableRate = rates.find(r => r.year === year) || rates[rates.length - 1];
    const growthRate = applicableRate ? applicableRate.rate / 100 : 0;
    totalTraffic += cumulativeGrowth;
    cumulativeGrowth *= (1 + growthRate);
  }
  
  const result = totalTraffic / designPeriod;
  // Guard against infinity/NaN
  if (!isFinite(result) || isNaN(result)) return 1;
  return result;
};

export const calculateRangeBasedGrowthFactor = (ranges: GrowthRateRange[], designPeriod: number, baseYear?: number): number => {
  const startYear = baseYear || new Date().getFullYear();
  let endYear = startYear + designPeriod;
  let cumulativeGrowth = 1;
  let totalTraffic = 0;
  
  for (let year = startYear; year < endYear; year++) {
    // Find applicable range for this year
    const applicableRange = ranges.find(r => year >= r.startYear && year <= r.endYear);
    
    if (!applicableRange) {
      // If no range applies, use default growth rate of 0%
      totalTraffic += cumulativeGrowth;
    } else {
      // Apply growth from the range
      const growthRate = applicableRange.rate / 100;
      totalTraffic += cumulativeGrowth;
      cumulativeGrowth *= (1 + growthRate);
    }
  }
  
  const result = totalTraffic / designPeriod;
  // Guard against infinity/NaN
  if (!isFinite(result) || isNaN(result)) return 1;
  return result;
};

// Calculate effective growth rate range for display purposes
export const getEffectiveGrowthRateRange = (rates: GrowthRate[] | GrowthRateRange[]): { min: number; max: number } => {
  if (rates.length === 0) return { min: 0, max: 0 };
  
  const rateValues = rates.map(r => 'rate' in r ? r.rate : 0);
  return {
    min: Math.min(...rateValues),
    max: Math.max(...rateValues)
  };
};

// Format growth rate for display - shows range for variable rates
export const formatGrowthRate = (growthRate: number | number[]): string => {
  if (Array.isArray(growthRate)) {
    if (growthRate.length === 0) return 'N/A';
    const min = Math.min(...growthRate);
    const max = Math.max(...growthRate);
    if (min === max) return `${min.toFixed(1)}%`;
    return `${min.toFixed(1)}% - ${max.toFixed(1)}%`;
  }
  if (!isFinite(growthRate) || isNaN(growthRate)) return 'N/A';
  return `${growthRate.toFixed(1)}%`;
};

export const createTemplateFile = (fileType: 'vehicle' | 'growth') => {
  let csvContent = '';
  
  if (fileType === 'vehicle') {
    csvContent = 'Vehicle Class,Percent of AADT,Truck Factor\n';
    csvContent += 'Passenger Cars,40,0.0008\n';
    csvContent += 'Medium Buses,10,0.400\n';
    csvContent += 'Large Buses,5,0.900\n';
    csvContent += 'Light Trucks,15,0.008\n';
    csvContent += 'Medium Trucks (2-axle),10,0.300\n';
    csvContent += 'Heavy Trucks (3-axle),8,0.850\n';
    csvContent += 'Semi-Trailer (4-axle),5,1.150\n';
    csvContent += 'Semi-Trailer (5-axle),4,1.550\n';
    csvContent += 'Semi-Trailer (6-axle),3,2.000\n';
  } else {
    csvContent = 'Year,Growth Rate (%)\n';
    const currentYear = new Date().getFullYear();
    csvContent += `${currentYear},3.0\n`;
    csvContent += `${currentYear + 1},4.0\n`;
    csvContent += `${currentYear + 2},5.0\n`;
    csvContent += `${currentYear + 5},2.0\n`;
  }
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  FileSaver.saveAs(blob, fileType === 'vehicle' ? 'VehicleData_Template.csv' : 'GrowthRate_Template.csv');
};

export const exportCalculationResults = (
  vehicleData: VehicleEsalData[], 
  formValues: FormValues, 
  totalDesignEsals: number
) => {
  let csvContent = 'Vehicle Class,Percent of AADT,AADT,Directional AADT,Lane AADT,Growth Rate,Growth Factor,Yearly Traffic,Truck Factor,Design ESALs\n';
  
  vehicleData.forEach(vehicle => {
    csvContent += `${vehicle.vehicleClass},`;
    csvContent += `${vehicle.percentOfAadt},`;
    csvContent += `${vehicle.aadt},`;
    csvContent += `${vehicle.directionalAadt},`;
    csvContent += `${vehicle.designLaneAadt},`;
    csvContent += `${Array.isArray(vehicle.growthRate) ? 'Variable' : vehicle.growthRate},`;
    csvContent += `${vehicle.growthFactor},`;
    csvContent += `${vehicle.yearlyTraffic},`;
    csvContent += `${vehicle.truckFactor},`;
    csvContent += `${vehicle.designEsals}\n`;
  });
  
  csvContent += `\nTotal,100,${formValues.aadt},${formValues.aadt * (formValues.directionDistribution/100)},${formValues.aadt * (formValues.directionDistribution/100) * (formValues.laneDistribution/100)},,,,${totalDesignEsals}\n`;
  csvContent += `\nParameters,Values\n`;
  csvContent += `Design Period,${formValues.designPeriod}\n`;
  csvContent += `Direction Distribution Factor,${formValues.directionDistribution/100}\n`;
  csvContent += `Lane Distribution Factor,${formValues.laneDistribution/100}\n`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  FileSaver.saveAs(blob, `Design_ESAL_Results_${new Date().toISOString().split('T')[0]}.csv`);
};

// New function to convert truck factor data from TruckFactor component to VehicleEsalData
export const convertTruckFactorDataToVehicleEsalData = (data: TruckFactorCSVRow[]): VehicleEsalData[] => {
  return data.map(row => {
    const vehicleClass = row['Vehicle Class'] || '';
    const percentOfAadt = parseFloat(row['Percent of AADT']) || 0;
    const truckFactor = parseFloat(row['Truck Factor']) || 0;
    
    return {
      vehicleClass,
      percentOfAadt,
      truckFactor,
      aadt: 0,
      directionalAadt: 0,
      designLaneAadt: 0,
      growthRate: 0,
      growthFactor: 0,
      yearlyTraffic: 0,
      designEsals: 0
    };
  });
};

/**
 * Round ESAL value to the specified precision option
 */
export const roundESAL = (value: number, option: ESALRoundingOption): number => {
  if (!isFinite(value) || isNaN(value)) return 0;
  return Math.round(value / option) * option;
};

/**
 * Format rounded ESAL value with appropriate suffix
 */
export const formatRoundedESAL = (value: number, option: ESALRoundingOption): string => {
  const rounded = roundESAL(value, option);
  if (rounded >= 1000000000) {
    return `${(rounded / 1000000000).toFixed(1)} billion`;
  }
  if (rounded >= 1000000) {
    return `${(rounded / 1000000).toFixed(1)} million`;
  }
  return rounded.toLocaleString();
};

/**
 * Validate that AADT percentages sum to 100%
 */
export const validateAADTPercentages = (percentages: number[]): AADTValidationResult => {
  const total = percentages.reduce((sum, p) => sum + (p || 0), 0);
  const isValid = Math.abs(total - 100) < 0.01; // Allow small floating point tolerance
  
  return {
    isValid,
    totalPercentage: total,
    message: isValid 
      ? undefined 
      : `AADT percentages sum to ${total.toFixed(1)}%, not 100%`
  };
};

/**
 * Calculate yearly ESAL data for chart visualization
 * Returns array of yearly ESAL values for each year in the design period
 */
export const calculateYearlyESALData = (
  vehicleData: VehicleEsalData[],
  formValues: FormValues
): YearlyESALData[] => {
  const baseYear = formValues.baseYear || new Date().getFullYear();
  const designPeriod = formValues.designPeriod;
  const directionFactor = formValues.directionDistribution / 100;
  const laneFactor = formValues.laneDistribution / 100;
  
  const yearlyData: YearlyESALData[] = [];
  let cumulativeESAL = 0;
  
  for (let i = 0; i < designPeriod; i++) {
    const year = baseYear + i;
    let yearlyESAL = 0;
    
    // Calculate ESAL for each vehicle class for this year
    vehicleData.forEach(vehicle => {
      const baseAADT = formValues.aadt * (vehicle.percentOfAadt / 100);
      const growthRate = Array.isArray(vehicle.growthRate) 
        ? (vehicle.growthRate[i] || vehicle.growthRate[vehicle.growthRate.length - 1] || 0)
        : vehicle.growthRate;
      
      // AADT grows each year
      const yearAADT = baseAADT * Math.pow(1 + growthRate / 100, i);
      const dirAADT = yearAADT * directionFactor;
      const laneAADT = dirAADT * laneFactor;
      
      // Annual traffic * 365 days * truck factor
      const vehicleYearlyESAL = laneAADT * 365 * vehicle.truckFactor;
      yearlyESAL += vehicleYearlyESAL;
    });
    
    cumulativeESAL += yearlyESAL;
    
    yearlyData.push({
      year,
      yearlyESAL: Math.round(yearlyESAL),
      cumulativeESAL: Math.round(cumulativeESAL)
    });
  }
  
  return yearlyData;
};

