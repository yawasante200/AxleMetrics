import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { GrowthRate, GrowthRateRange, GrowthRateType } from './types';

interface VariableGrowthRateFormProps {
  designPeriod: number;
  growthRateType: GrowthRateType;
  setGrowthRateType: (type: GrowthRateType) => void;
  yearlyRates: GrowthRate[];
  setYearlyRates: (rates: GrowthRate[]) => void;
  rangeRates: GrowthRateRange[];
  setRangeRates: (rates: GrowthRateRange[]) => void;
}

const VariableGrowthRateForm: React.FC<VariableGrowthRateFormProps> = ({
  designPeriod,
  growthRateType,
  setGrowthRateType,
  yearlyRates,
  setYearlyRates,
  rangeRates,
  setRangeRates
}) => {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + designPeriod - 1;
  
  // Initialize yearly rates if empty
  React.useEffect(() => {
    if (yearlyRates.length === 0 && growthRateType === GrowthRateType.YEARLY) {
      const initialRates: GrowthRate[] = [];
      for (let i = 0; i < designPeriod; i++) {
        initialRates.push({
          year: currentYear + i,
          rate: 4.0 // Default rate
        });
      }
      setYearlyRates(initialRates);
    }
  }, [designPeriod, growthRateType, yearlyRates.length, setYearlyRates, currentYear]);

  // Initialize range rates if empty
  React.useEffect(() => {
    if (rangeRates.length === 0 && growthRateType === GrowthRateType.RANGE) {
      setRangeRates([
        {
          startYear: currentYear,
          endYear: endYear,
          rate: 4.0 // Default rate
        }
      ]);
    }
  }, [designPeriod, growthRateType, rangeRates.length, setRangeRates, currentYear, endYear]);

  const handleYearlyRateChange = (index: number, rate: number) => {
    const updatedRates = [...yearlyRates];
    updatedRates[index] = { ...updatedRates[index], rate };
    setYearlyRates(updatedRates);
  };

  const handleRangeAdd = () => {
    // Find the end of the last range
    const lastRange = rangeRates[rangeRates.length - 1];
    const newStartYear = lastRange.endYear + 1;
    
    // Don't add if we've reached the end of the design period
    if (newStartYear > endYear) return;
    
    setRangeRates([
      ...rangeRates,
      {
        startYear: newStartYear,
        endYear: endYear,
        rate: 4.0
      }
    ]);
  };

  const handleRangeDelete = (index: number) => {
    // Don't delete if it's the last range
    if (rangeRates.length === 1) return;
    
    const updatedRanges = [...rangeRates];
    
    // If we're deleting a range in the middle, adjust the next range's start year
    if (index < updatedRanges.length - 1) {
      updatedRanges[index + 1].startYear = updatedRanges[index].startYear;
    }
    
    // Remove the range
    updatedRanges.splice(index, 1);
    
    setRangeRates(updatedRanges);
  };

  const handleRangeRateChange = (index: number, rate: number) => {
    const updatedRanges = [...rangeRates];
    updatedRanges[index].rate = rate;
    setRangeRates(updatedRanges);
  };

  const handleRangeEndYearChange = (index: number, endYear: number) => {
    // Don't allow ending after the design period
    if (endYear > currentYear + designPeriod - 1) return;
    
    // Don't allow ending before the start year
    if (endYear < rangeRates[index].startYear) return;
    
    const updatedRanges = [...rangeRates];
    updatedRanges[index].endYear = endYear;
    
    // Adjust the next range's start year if there is one
    if (index < updatedRanges.length - 1) {
      updatedRanges[index + 1].startYear = endYear + 1;
    }
    
    setRangeRates(updatedRanges);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="growthRateType"
            checked={growthRateType === GrowthRateType.CONSTANT}
            onChange={() => setGrowthRateType(GrowthRateType.CONSTANT)}
            className="mr-2"
          />
          Constant Growth Rate
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="growthRateType"
            checked={growthRateType === GrowthRateType.YEARLY}
            onChange={() => setGrowthRateType(GrowthRateType.YEARLY)}
            className="mr-2"
          />
          Yearly Growth Rates
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="growthRateType"
            checked={growthRateType === GrowthRateType.RANGE}
            onChange={() => setGrowthRateType(GrowthRateType.RANGE)}
            className="mr-2"
          />
          Growth Rate Ranges
        </label>
      </div>
      
      {growthRateType === GrowthRateType.YEARLY && (
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
          {yearlyRates.map((rate, index) => (
            <div key={rate.year} className="flex items-center space-x-2">
              <span className="w-16">{rate.year}:</span>
              <input
                type="number"
                value={rate.rate}
                onChange={(e) => handleYearlyRateChange(index, parseFloat(e.target.value))}
                step="0.1"
                min="0"
                max="30"
                className="flex h-8 w-20 rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm"
              />
              <span>%</span>
            </div>
          ))}
        </div>
      )}
      
      {growthRateType === GrowthRateType.RANGE && (
        <div className="space-y-2">
          {rangeRates.map((range, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
              <span>Years {range.startYear} - </span>
              <input
                type="number"
                value={range.endYear}
                onChange={(e) => handleRangeEndYearChange(index, parseInt(e.target.value))}
                min={range.startYear}
                max={currentYear + designPeriod - 1}
                className="flex h-8 w-20 rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm"
              />
              <span>at</span>
              <input
                type="number"
                value={range.rate}
                onChange={(e) => handleRangeRateChange(index, parseFloat(e.target.value))}
                step="0.1"
                min="0"
                max="30"
                className="flex h-8 w-20 rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm"
              />
              <span>%</span>
              <button
                type="button"
                onClick={() => handleRangeDelete(index)}
                className="text-red-500 hover:text-red-700"
                disabled={rangeRates.length === 1}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleRangeAdd}
            className="flex items-center text-blue-500 hover:text-blue-700"
            disabled={rangeRates[rangeRates.length - 1]?.endYear === endYear}
          >
            <Plus size={16} className="mr-1" /> Add Range
          </button>
        </div>
      )}
    </div>
  );
};

export default VariableGrowthRateForm;