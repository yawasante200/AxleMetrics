
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
  } else if (axleType === 'Quad') {
    standardLoad = config.standardAxleLoads.quad[config.unit];
  }
  return Math.pow(axleLoad / standardLoad, config.loadEquivalencyExponent);
};


export const calculateAASHTOEALF = (
  lx: number, 
  axleType: string, 
  type: 'flexible' | 'rigid', 
  config: ESALConfig
): number => {
  // Force conversion to kips if not already in kips
  const loadInKips = lx * CONSTANTS.KG_TO_KIP;
  const l2 = axleType === 'Single' ? 1 : axleType === 'Tandem' ? 2 : axleType === 'Tridem' ? 3 : axleType === 'Quad' ? 4 : 1;

  if (type === 'flexible') {
    // AASHTO 1993 Flexible Pavement Formula - CORRECTED
    // Equation 2.1a: log(Wtx/Wt18) = 6.1252 - 4.79log(Lx+L2) + 4.33logL2 + Gt/βx - Gt/β18
    // Equation 2.1b: Gt = log((4.2-pt)/(4.2-1.5))
    // Equation 2.1c: βx = 0.40 + [0.081(Lx+L2)^3.23] / [(SN+1)^5.19 × L2^3.23]
    // Equation 2.1d: EALF = Wt18/Wtx (the inverse!)
    
    const Gt = Math.log10((4.2 - config.ptVal) / (4.2 - 1.5));
    
    const numeratorX = 0.081 * Math.pow(loadInKips + l2, 3.23);
    const denominatorX = Math.pow(config.snVal + 1, 5.19) * Math.pow(l2, 3.23);
    const betaX = 0.40 + numeratorX / denominatorX;
    
    const numerator18 = 0.081 * Math.pow(18 + 1, 3.23);
    const denominator18 = Math.pow(config.snVal + 1, 5.19) * Math.pow(1, 3.23);
    const beta18 = 0.40 + numerator18 / denominator18;
    
    const logWtxOverWt18 = 6.1252 - 
                           4.79 * Math.log10(loadInKips + l2) + 
                           4.33 * Math.log10(l2) + 
                           Gt / betaX - 
                           Gt / beta18;
    
    const WtxOverWt18 = Math.pow(10, logWtxOverWt18);
    
    // Equation 2.1d: EALF = Wt18/Wtx = 1/(Wtx/Wt18)
    const EALF = 1.0 / WtxOverWt18;
    
    return EALF;
    
  } else {
    // AASHTO 1993 Rigid Pavement Formula - CORRECTED
    // Equation 2.2a: log(Wtx/Wt18) = 5.908 - 4.62×log(Lx+L2) + 3.28×log(L2) + Gt/βx - Gt/β18
    // Equation 2.2b: Gt = log((4.5-pt)/(4.5-1.5))
    // Equation 2.2c: βx = 1.0 + [3.63(Lx+L2)^5.20] / [(D+1)^8.46 × L2^3.52]
    // Equation 2.2d: EALF = Wt18/Wtx (the inverse!)
    
    const Gt = Math.log10((4.5 - config.ptVal) / (4.5 - 1.5));
    
    const numeratorX = 3.63 * Math.pow(loadInKips + l2, 5.20);
    const denominatorX = Math.pow(config.dVal + 1, 8.46) * Math.pow(l2, 3.52);
    const betaX = 1.0 + numeratorX / denominatorX;
    
    const numerator18 = 3.63 * Math.pow(18 + 1, 5.20);
    const denominator18 = Math.pow(config.dVal + 1, 8.46) * Math.pow(1, 3.52);
    const beta18 = 1.0 + numerator18 / denominator18;
    
    const logWtxOverWt18 = 5.908 - 
                           4.62 * Math.log10(loadInKips + l2) + 
                           3.28 * Math.log10(l2) + 
                           Gt / betaX - 
                           Gt / beta18;
    
    const WtxOverWt18 = Math.pow(10, logWtxOverWt18);
    
    // Equation 2.2d: EALF = Wt18/Wtx = 1/(Wtx/Wt18)
    const EALF = 1.0 / WtxOverWt18;
    
    return EALF;
  }
};
// Test with your example
const testConfig = {
  ptVal: 2.0,
  dVal: 7.0,
  snVal: 5,
  standardAxleLoads: {
    single: { kg: 8164, kN: 80, kips: 18 },
    tandem: { kg: 13766.17, kN: 135, kips: 30 },
    tridem: { kg: 18558.84, kN: 182, kips: 41 },
    quad: { kg: 23351.50, kN: 229, kips: 52 }
  },
  loadEquivalencyExponent: 4.5,
  unit: 'kg' as const
};

console.log('Testing corrected formula:\n');
console.log('Test 1: 50000 kg Tandem on 7" rigid pavement');
const result1 = calculateAASHTOEALF(50000, 'Tandem', 'rigid', testConfig);
console.log(`Result: ${result1.toFixed(4)} ESALs\n`);

console.log('Test 2: Standard 14515 kg (32 kip) Tandem on 7" rigid pavement');
const result2 = calculateAASHTOEALF(14515, 'Tandem', 'rigid', testConfig);
console.log(`Result: ${result2.toFixed(4)} ESALs\n`);

console.log('Test 3: Standard 8165 kg (18 kip) Single on 7" rigid pavement');
const result3 = calculateAASHTOEALF(8165, 'Single', 'rigid', testConfig);
console.log(`Result: ${result3.toFixed(4)} ESALs (should be close to 1.0)\n`);

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
    },
    quad: {
      kg: 23351.50,
      kN: 229,
      kips: 52
    }
  },
  loadEquivalencyExponent: 4.5,
  unit: 'kg'
});
