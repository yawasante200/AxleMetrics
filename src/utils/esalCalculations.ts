export const CONSTANTS = {
  KG_TO_KIP: 0.0022046226,
  PT_VAL: 2.5,
  SN_VAL: 5,
  D_VAL: 8.0,
  STANDARD_AXLE_LOADS: {
    SINGLE: 8164,    // kg for single axle
    TANDEM: 13766.17, // kg for 2 axles
    TRIDEM: 18558.84, // kg for 3 axles
  },
  LOAD_EQUIVALENCY_EXPONENT: 4.5
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

export const calculateSimplifiedEALF = (axleLoad: number, axleType: string): number => {
  const { STANDARD_AXLE_LOADS, LOAD_EQUIVALENCY_EXPONENT } = CONSTANTS;
  let standardLoad = STANDARD_AXLE_LOADS.SINGLE; // Default to single axle

  if (axleType === 'Tandem') {
    standardLoad = STANDARD_AXLE_LOADS.TANDEM;
  } else if (axleType === 'Tridem') {
    standardLoad = STANDARD_AXLE_LOADS.TRIDEM;
  }

  return Math.pow(axleLoad / standardLoad, LOAD_EQUIVALENCY_EXPONENT);
};

export const calculateAASHTOEALF = (lx: number, axleType: string, type: 'flexible' | 'rigid'): number => {
  const l2 = axleType === 'Single' ? 1 : axleType === 'Tandem' ? 2 : axleType === 'Tridem' ? 3 : axleType === 'Quad' ? 4 : 1;
  const { PT_VAL, SN_VAL, D_VAL } = CONSTANTS;

  if (type === 'flexible') {
    return 1 / Math.pow(10, 6.1252 - 4.79 * Math.log10(lx + l2) + 4.33 * Math.log10(l2) +
      Math.log10((4.2 - PT_VAL) / (4.2 - 1.5)) * (
        0.40 + (0.081 * Math.pow(lx + l2, 3.23)) / (Math.pow(SN_VAL + 1, 5.19) * Math.pow(l2, 3.23)) -
        (0.40 + (0.081 * Math.pow(18 + 1, 3.23)) / (Math.pow(SN_VAL + 1, 5.19) * Math.pow(1, 3.23)))
      ));
  } else {
    return 1 / Math.pow(10, 5.908 - 4.62 * Math.log10(lx + l2) + 3.28 * Math.log10(l2) +
      Math.log10((4.5 - PT_VAL) / (4.5 - 1.5)) * (
        1.0 + (3.63 * Math.pow(lx + l2, 5.20)) / (Math.pow(D_VAL + 1, 8.46) * Math.pow(l2, 3.52)) -
        (1.0 + (3.63 * Math.pow(18 + 1, 5.20)) / (Math.pow(D_VAL + 1, 8.46) * Math.pow(1, 3.52)))
      ));
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