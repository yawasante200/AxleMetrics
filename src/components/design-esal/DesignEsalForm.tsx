import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues, GrowthRateType, GrowthRate, GrowthRateRange } from './types';
import GrowthRateOptions from './GrowthRateOptions';

interface DesignEsalFormProps {
  onSubmit: (data: FormValues) => void;
  useVariableGrowthRate: boolean;
  onUseVariableGrowthRateChange: (value: boolean) => void;
  onGrowthRateUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  growthRates: GrowthRate[];
  setGrowthRates: (rates: GrowthRate[]) => void;
  growthRateRanges: GrowthRateRange[];
  setGrowthRateRanges: (ranges: GrowthRateRange[]) => void;
  vehicleDataLength: number;
  growthRatesLength: number;
  setDesignPeriod: (period: number) => void;
  growthRateType: GrowthRateType;
  setGrowthRateType: (type: GrowthRateType) => void;
  designPeriod: number;
  defaultValues: FormValues;
}

const DesignEsalForm: React.FC<DesignEsalFormProps> = ({
  onSubmit,
  useVariableGrowthRate,
  onUseVariableGrowthRateChange,
  onGrowthRateUpload,
  growthRates,
  setGrowthRates,
  growthRateRanges,
  setGrowthRateRanges,
  vehicleDataLength,
  growthRatesLength,
  setDesignPeriod,
  growthRateType,
  setGrowthRateType,
  designPeriod,
  defaultValues
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  // Update parent component when design period changes
  useEffect(() => {
    const period = form.watch("designPeriod");
    setDesignPeriod(period);
  }, [form.watch("designPeriod"), setDesignPeriod]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Annual Average Daily Traffic (AADT)
          </label>
          <input
            type="number"
            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. 10000"
            {...form.register("aadt")}
          />
          <p className="text-sm text-gray-500">Total volume of vehicle traffic for a year</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Traffic Growth Rate (%)
          </label>
          <input
            type="number"
            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. 4"
            {...form.register("growthRate")}
            disabled={useVariableGrowthRate}
          />
          <p className="text-sm text-gray-500">Annual traffic growth percentage</p>
        </div>


        {/* Growth Rate Options - Now embedded in the form */}
        <div className="md:col-span-3 border-y border-gray-100 py-4 my-2">
          <GrowthRateOptions
            useVariableGrowthRate={useVariableGrowthRate}
            onUseVariableGrowthRateChange={onUseVariableGrowthRateChange}
            onGrowthRateUpload={onGrowthRateUpload}
            growthRates={growthRates}
            setGrowthRates={setGrowthRates}
            growthRateType={growthRateType}
            setGrowthRateType={setGrowthRateType}
            designPeriod={designPeriod}
            growthRateRanges={growthRateRanges}
            setGrowthRateRanges={setGrowthRateRanges}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Design Period (years)
          </label>
          <input
            type="number"
            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. 20"
            {...form.register("designPeriod")}
          />
          <p className="text-sm text-gray-500">Expected lifespan of the pavement</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Directional Distribution (%)
          </label>
          <input
            type="number"
            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. 50"
            {...form.register("directionDistribution")}
          />
          <p className="text-sm text-gray-500">Percentage of traffic in design direction</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Lane Distribution (%)
          </label>
          <input
            type="number"
            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. 80"
            {...form.register("laneDistribution")}
          />
          <p className="text-sm text-gray-500">Percentage of traffic in design lane</p>
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-9 px-4 py-2"
        disabled={(useVariableGrowthRate && growthRateType === GrowthRateType.YEARLY && growthRatesLength === 0)}
      >
        Next: Vehicle Data
      </button>
    </form>
  );
};

export default DesignEsalForm;
