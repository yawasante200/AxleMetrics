import React, { useRef } from 'react';
import { FilePlus2, UploadCloud } from 'lucide-react';
import { createTemplateFile } from './utils';
import { GrowthRate, GrowthRateRange, GrowthRateType } from './types';
import VariableGrowthRateForm from './VariableGrowthRateForm';

interface GrowthRateOptionsProps {
  useVariableGrowthRate: boolean;
  onUseVariableGrowthRateChange: (value: boolean) => void;
  onGrowthRateUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  growthRates: GrowthRate[];
  setGrowthRates: (rates: GrowthRate[]) => void;
  growthRateType: GrowthRateType;
  setGrowthRateType: (type: GrowthRateType) => void;
  designPeriod: number;
  growthRateRanges: GrowthRateRange[];
  setGrowthRateRanges: (ranges: GrowthRateRange[]) => void;
}

const GrowthRateOptions: React.FC<GrowthRateOptionsProps> = ({
  useVariableGrowthRate,
  onUseVariableGrowthRateChange,
  onGrowthRateUpload,
  growthRates,
  setGrowthRates,
  growthRateType,
  setGrowthRateType,
  designPeriod,
  growthRateRanges,
  setGrowthRateRanges
}) => {
  const growthRateFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">2. Growth Rate Options</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <input 
            type="checkbox" 
            id="variableGrowth"
            checked={useVariableGrowthRate}
            onChange={(e) => onUseVariableGrowthRateChange(e.target.checked)}
            className="mt-1"
          />
          <div>
            <label htmlFor="variableGrowth" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Use variable growth rates
            </label>
            <p className="text-sm text-gray-500">
              Configure yearly or range-based growth rates instead of using a constant rate
            </p>
          </div>
        </div>
        
        {useVariableGrowthRate && (
          <>
            {/* Variable Growth Rate Form */}
            <div className="p-4 border rounded-md bg-gray-50">
              <VariableGrowthRateForm 
                designPeriod={designPeriod}
                growthRateType={growthRateType}
                setGrowthRateType={setGrowthRateType}
                yearlyRates={growthRates}
                setYearlyRates={setGrowthRates}
                rangeRates={growthRateRanges}
                setRangeRates={setGrowthRateRanges}
              />
            </div>
            
            {/* CSV Upload Option */}
            <div className="flex items-center gap-2 mt-2">
              <button 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2"
                onClick={() => createTemplateFile('growth')}
                type="button"
              >
                <FilePlus2 className="mr-2 h-4 w-4" />
                Growth Rate Template
              </button>
              <button 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2"
                onClick={() => growthRateFileInputRef.current?.click()}
                type="button"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Growth Rates
              </button>
              <input
                ref={growthRateFileInputRef}
                type="file"
                accept=".csv"
                onChange={onGrowthRateUpload}
                className="hidden"
              />
            </div>
          </>
        )}
        
        {growthRates.length > 0 && useVariableGrowthRate && growthRateType === GrowthRateType.YEARLY && (
          <p className="text-sm text-green-600">
            ✓ {growthRates.length} yearly growth rates configured
          </p>
        )}
        
        {growthRateRanges.length > 0 && useVariableGrowthRate && growthRateType === GrowthRateType.RANGE && (
          <p className="text-sm text-green-600">
            ✓ {growthRateRanges.length} growth rate ranges configured
          </p>
        )}
      </div>
    </div>
  );
};

export default GrowthRateOptions;
