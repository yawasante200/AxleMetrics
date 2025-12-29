// This is config.ts
// It contains the types for the configuration

export interface ESALConfig {
  ptVal: number;
  snVal: number;
  dVal: number;
  standardAxleLoads: {
    single: { kg: number; kN: number; kips: number };
    tandem: { kg: number; kN: number; kips: number };
    tridem: { kg: number; kN: number; kips: number };
    quad: { kg: number; kN: number; kips: number };
  };
  loadEquivalencyExponent: number;
  unit: 'kN' | 'kips' | 'kg';
}
