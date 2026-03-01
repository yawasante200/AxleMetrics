
import { z } from "zod";

export const formSchema = z.object({
  aadt: z.coerce.number().min(1, "AADT must be at least 1"),
  growthRate: z.coerce.number().min(0, "Growth rate cannot be negative").max(30, "Growth rate seems too high"),
  designPeriod: z.coerce.number().min(1, "Design period must be at least 1 year").max(50, "Design period must be less than 50 years"),
  directionDistribution: z.coerce.number().min(0, "Percentage cannot be negative").max(100, "Percentage cannot exceed 100"),
  laneDistribution: z.coerce.number().min(0, "Percentage cannot be negative").max(100, "Percentage cannot exceed 100"),
  baseYear: z.coerce.number().min(1990, "Base year must be 1990 or later").max(new Date().getFullYear() + 10, "Base year seems too far in the future"),
});

export type FormValues = z.infer<typeof formSchema>;

export interface TruckFactorCSVRow {
  'Vehicle Class': string;
  'Percent of AADT': string;
  'Truck Factor': string;
  [key: string]: string;
}

export interface GrowthRateCSVRow {
  'Year': string;
  'Growth Rate (%)': string;
  [key: string]: string;
}

export interface GrowthRate {
  year: number;
  rate: number;
}

export interface GrowthRateRange {
  startYear: number;
  endYear: number;
  rate: number;
}

export interface VehicleType {
  name: string;
  truckFactor: number;
}

// CompanyDetails is imported from '../../types/truckFactor' where needed

export const commonVehicleTypes: VehicleType[] = [
  { name: "Passenger Car", truckFactor: 0.0008 },
  { name: "Light Trucks", truckFactor: 0.008 },
  { name: "Medium Trucks (2-axle)", truckFactor: 0.3 },
  { name: "Heavy Trucks (3-axle)", truckFactor: 0.85 },
  { name: "Semi-Trailer (4-axle)", truckFactor: 1.15 },
  { name: "Semi-Trailer (5-axle)", truckFactor: 1.55 },
  { name: "Semi-Trailer (6-axle)", truckFactor: 2.0 },
  { name: "Medium Buses", truckFactor: 0.4 },
  { name: "Large Buses", truckFactor: 0.9 }
];

export enum GrowthRateType {
  CONSTANT = "constant",
  YEARLY = "yearly",
  RANGE = "range"
}

// Report metadata for project information
export interface ReportMetadata {
  projectLocation: string;
  projectLength: number;
  projectLengthUnit: 'km' | 'miles' | 'feet' | 'meters';
  analystName: string;
}

// ESAL rounding options
export enum ESALRoundingOption {
  NONE = 1,
  NEAREST_100 = 100,
  NEAREST_1000 = 1000,
  NEAREST_MILLION = 1000000,
  NEAREST_BILLION = 1000000000
}

// AADT validation result
export interface AADTValidationResult {
  isValid: boolean;
  totalPercentage: number;
  message?: string;
}

// Yearly ESAL data for charts (Design ESAL vs Year)
export interface YearlyESALData {
  year: number;
  cumulativeESAL: number;
  yearlyESAL: number;
}