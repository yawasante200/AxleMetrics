
import { Result, CompanyDetails } from '../types/truckFactor';
import { ESALConfig } from '../types/config';
import { generateEsalFactorPDF } from './esalFactorPdfGenerator';

export const generatePDF = async (
  data: Result[],
  formData: CompanyDetails,
  esalType: 'simplified' | 'AASHTO',
  pavementType: 'flexible' | 'rigid',
  config: ESALConfig
): Promise<void> => {
  if (!data || data.length === 0) {
    alert('No data available to generate PDF.');
    return;
  }

  await generateEsalFactorPDF(data, formData, config, pavementType, esalType);
};
