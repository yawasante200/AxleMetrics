// This is TruckFactor.ts
// It contains the types for the truck factor calculation
export interface CompanyDetails {
  company: string;
  address: string;
  phone: string;
  date: string;
  project: string;
  name: string;
  // New fields for project metadata
  projectLocation?: string;
  projectLength?: number;
  projectLengthUnit?: 'km' | 'miles' | 'feet' | 'meters';
  analystName?: string;
  inputDataUnit?: 'kg' | 'kN' | 'kips';
}

export interface Result {
  axleType: string;
  configuration: string[];
  averageESAL: number;
}

export interface TruckFactorProps {
  onBack?: () => void;
  onProceed?: (pavementType: 'flexible' | 'rigid', action: 'create' | 'import') => void;
  downloadExcelTemplate?: () => void;
}

export interface TruckFactorCSVRow {
  'Vehicle Class': string;
  'Percent of AADT': string;
  'Truck Factor': string;
}