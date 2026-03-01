
import { calculateSimplifiedEALF, getDefaultConfig } from './src/utils/esalCalculations';

const config = getDefaultConfig();
const unit = 'kg';

console.log('--- Simplified ESAL Test ---');
console.log('Exponent:', config.loadEquivalencyExponent);
console.log('Single Standard:', config.standardAxleLoads.single[unit]);
console.log('Tandem Standard:', config.standardAxleLoads.tandem[unit]);

const load = 10000;

const esalSingle = calculateSimplifiedEALF(load, 'Single', config);
const esalTandem = calculateSimplifiedEALF(load, 'Tandem', config);

console.log(`Load: ${load} kg`);
console.log(`Single ESAL: ${esalSingle.toFixed(4)} (Expected: ${(Math.pow(load / 8164, 4.5)).toFixed(4)})`);
console.log(`Tandem ESAL: ${esalTandem.toFixed(4)} (Expected: ${(Math.pow(load / 13766.17, 4.5)).toFixed(4)})`);

if (esalSingle !== esalTandem) {
  console.log('SUCCESS: Different standard loads are being used!');
} else {
  console.log('FAILURE: Same standard load used for both!');
}
