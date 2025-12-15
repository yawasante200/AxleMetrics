
import { Result, CompanyDetails } from '../types/truckFactor';
import { ESALConfig } from '../types/config';
import { generateFlexibleOriginalPDF } from './flexibleOriginalPdfGenerator';
import { generateRigidOriginalPDF } from './rigidOriginalPdfGenerator';
import { generateFlexibleSimplifiedPDF } from './flexibleSimplifiedPdfGenerator';

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

  if (esalType === 'simplified') {
    await generateFlexibleSimplifiedPDF(data, formData, config);
  } else if (pavementType === 'flexible') {
    await generateFlexibleOriginalPDF(data, formData, config);
  } else {
    await generateRigidOriginalPDF(data, formData, config);
  }
};
