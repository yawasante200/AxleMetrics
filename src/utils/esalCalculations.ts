
import { ESALConfig } from '../types/config';

export const CONSTANTS = {
  KG_TO_KIP: 0.0022046226,
  KG_TO_KN: 0.00981,
};

export const interpretAxleType = (config: number[]): string[] => {
  return config.map(group => {
    if (group === 1) return 'Single';
    if (group === 2) return 'Tandem';
    if (group === 3) return 'Tridem';
    if (group === 4) return 'Quad';
    return 'Single';
  });
};

export const calculateSimplifiedEALF = (axleLoad: number, axleType: string, config: ESALConfig): number => {
  let standardLoad = config.standardAxleLoads.single[config.unit];

  if (axleType === 'Tandem') {
    standardLoad = config.standardAxleLoads.tandem[config.unit];
  } else if (axleType === 'Tridem') {
    standardLoad = config.standardAxleLoads.tridem[config.unit];
  }

  return Math.pow(axleLoad / standardLoad, config.loadEquivalencyExponent);
};

export const calculateAASHTOEALF = (lx: number, axleType: string, type: 'flexible' | 'rigid', config: ESALConfig): number => {
  // Force conversion to kips if not already in kips
  const loadInKips = lx * CONSTANTS.KG_TO_KIP;
  const l2 = axleType === 'Single' ? 1 : axleType === 'Tandem' ? 2 : axleType === 'Tridem' ? 3 : axleType === 'Quad' ? 4 : 1;

  if (type === 'flexible') {
    const beta = Math.log10((4.2 - config.ptVal) / (4.2 - 1.5));
    const term1 = 0.40 + (0.081 * Math.pow(loadInKips + l2, 3.23)) / (Math.pow(config.snVal + 1, 5.19) * Math.pow(l2, 3.23));
    const term2 = 0.40 + (0.081 * Math.pow(18 + 1, 3.23)) / (Math.pow(config.snVal + 1, 5.19) * Math.pow(1, 3.23));
    
    return Math.pow(10, -(6.1252 - 4.79 * Math.log10(loadInKips + l2) + 4.33 * Math.log10(l2) + beta * (term1 - term2)));
  } else {
    const beta = Math.log10((4.5 - config.ptVal) / (4.5 - 1.5));
    const term1 = 1.0 + (3.63 * Math.pow(loadInKips + l2, 5.20)) / (Math.pow(config.dVal + 1, 8.46) * Math.pow(l2, 3.52));
    const term2 = 1.0 + (3.63 * Math.pow(18 + 1, 5.20)) / (Math.pow(config.dVal + 1, 8.46) * Math.pow(1, 3.52));
    
    return Math.pow(10, -(5.908 - 4.62 * Math.log10(loadInKips + l2) + 3.28 * Math.log10(l2) + beta * (term1 - term2)));
  }
};

export const processConfiguration = (config: number[], axles: number[], method: 'simplified' | 'AASHTO'): number[] => {
  const combinedAxles: number[] = [];
  let idx = 0;

  for (const group of config) {
    if (group === 1) {
      combinedAxles.push(axles[idx]);
      idx++;
    } else {
      const combinedLoad = axles.slice(idx, idx + group).reduce((sum, load) => sum + load, 0);
      combinedAxles.push(combinedLoad);
      idx += group;
    }
  }

  return combinedAxles;
};

export const getDefaultConfig = (): ESALConfig => ({
  ptVal: 2.5,
  snVal: 5,
  dVal: 8.0,
  standardAxleLoads: {
    single: {
      kg: 8164,
      kN: 80,
      kips: 18
    },
    tandem: {
      kg: 13766.17,
      kN: 135,
      kips: 30
    },
    tridem: {
      kg: 18558.84,
      kN: 182,
      kips: 41
    }
  },
  loadEquivalencyExponent: 4.5,
  unit: 'kg'
});
