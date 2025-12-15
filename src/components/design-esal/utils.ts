import { VehicleEsalData } from '../DesignEsalTable';
import { FormValues, GrowthRate, GrowthRateRange, TruckFactorCSVRow } from './types';
import * as FileSaver from 'file-saver';

export const calculateGrowthFactor = (growthRate: number, years: number): number => {
  const r = growthRate / 100;
  if (r === 0) return years;
  return (Math.pow(1 + r, years) - 1) / r;
};

export const calculateVariableYearlyGrowthFactor = (rates: GrowthRate[], designPeriod: number): number => {
  let currentYear = new Date().getFullYear();
  let endYear = currentYear + designPeriod;
  let cumulativeGrowth = 1;
  let totalTraffic = 0;

  for (let year = currentYear; year < endYear; year++) {
    const applicableRate = rates.find(r => r.year === year) || rates[rates.length - 1];
    const growthRate = applicableRate ? applicableRate.rate / 100 : 0;
    totalTraffic += cumulativeGrowth;
    cumulativeGrowth *= (1 + growthRate);
  }
  
  return totalTraffic / designPeriod;
};

export const calculateRangeBasedGrowthFactor = (ranges: GrowthRateRange[], designPeriod: number): number => {
  let currentYear = new Date().getFullYear();
  let endYear = currentYear + designPeriod;
  let cumulativeGrowth = 1;
  let totalTraffic = 0;
  
  for (let year = currentYear; year < endYear; year++) {
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
  
  return totalTraffic / designPeriod;
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
