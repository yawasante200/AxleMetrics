
export interface CompanyDetails {
  company: string;
  address: string;
  phone: string;
  date: string;
  project: string;
  name: string;
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
