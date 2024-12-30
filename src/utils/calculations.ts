export function calculateSimplifiedEALF(Lx: number, c: number, unit: 'kN' | 'kip'): number {
  const standardLoad = unit === 'kN' ? 80 : 18;
  return Math.pow(Lx / standardLoad, c);
}

export function calculateAASHOEALF(Lx: number, L2: number, pt: number, SN: number): number {
  const Gt = Math.log10((4.2 - pt) / (4.2 - 1.5));
  const betaX = 0.40 + (0.081 * Math.pow(Lx + L2, 3.23)) / (Math.pow(SN + 1, 5.19) * Math.pow(L2, 3.23));
  const beta18 = 0.40 + (0.081 * Math.pow(18 + L2, 3.23)) / (Math.pow(SN + 1, 5.19) * Math.pow(L2, 3.23));
  
  const logRatio = 6.1252 - 4.79 * Math.log10(Lx + L2) + 4.33 * Math.log10(L2) + Gt * (betaX - beta18);
  const WtRatio = Math.pow(10, logRatio);
  return 1 / WtRatio;
}