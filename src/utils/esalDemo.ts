
import { CONSTANTS } from './esalCalculations';

// Test case from user
const testCase = {
  axleLoadKg: 50000,
  axleType: 'Tandem',
  pt: 2.0,
  D: 7.0
};

console.log('================================================================================');
console.log('AASHTO RIGID PAVEMENT FORMULA DIAGNOSTIC - FINAL CORRECTED');
console.log('Using Equations 2.2a - 2.2d from AASHTO 1993');
console.log('IMPORTANT: EALF = Wt18/Wtx (inverse of the ratio calculated)');
console.log('================================================================================\n');

console.log('TEST CASE:');
console.log(`  Axle Load: ${testCase.axleLoadKg} kg`);
console.log(`  Axle Type: ${testCase.axleType}`);
console.log(`  Terminal PSI (pt): ${testCase.pt}`);
console.log(`  Slab Thickness (D): ${testCase.D} inches\n`);

// Convert to kips
const Lx = testCase.axleLoadKg * CONSTANTS.KG_TO_KIP;
const L2 = 2; // Tandem
console.log(`Step 1: Load in kips = ${Lx.toFixed(4)}`);
console.log(`Step 2: L2 (axle code) = ${L2}\n`);

console.log('================================================================================');
console.log('EQUATION 2.2b: Calculate Gt');
console.log('================================================================================');
console.log('Gt = log₁₀((4.5 - pt) / (4.5 - 1.5))\n');

const Gt = Math.log10((4.5 - testCase.pt) / (4.5 - 1.5));
console.log(`Gt = log₁₀((4.5 - ${testCase.pt}) / (4.5 - 1.5))`);
console.log(`Gt = log₁₀(${(4.5 - testCase.pt).toFixed(4)} / ${(4.5 - 1.5).toFixed(4)})`);
console.log(`Gt = log₁₀(${((4.5 - testCase.pt) / (4.5 - 1.5)).toFixed(6)})`);
console.log(`Gt = ${Gt.toFixed(6)}\n`);

console.log('================================================================================');
console.log('EQUATION 2.2c: Calculate βx (for actual load)');
console.log('================================================================================');
console.log('βx = 1.0 + [3.63(Lx + L2)^5.20] / [(D + 1)^8.46 × L2^3.52]\n');

const numeratorX = 3.63 * Math.pow(Lx + L2, 5.20);
const denominatorX = Math.pow(testCase.D + 1, 8.46) * Math.pow(L2, 3.52);
const betaX = 1.0 + numeratorX / denominatorX;

console.log(`Numerator = 3.63 × (${Lx.toFixed(4)} + ${L2})^5.20`);
console.log(`Numerator = 3.63 × ${(Lx + L2).toFixed(4)}^5.20`);
console.log(`Numerator = ${numeratorX.toExponential(6)}`);
console.log(`\nDenominator = (${testCase.D} + 1)^8.46 × ${L2}^3.52`);
console.log(`Denominator = ${(testCase.D + 1).toFixed(2)}^8.46 × ${L2}^3.52`);
console.log(`Denominator = ${denominatorX.toFixed(4)}`);
console.log(`\nβx = 1.0 + ${numeratorX.toExponential(6)} / ${denominatorX.toFixed(4)}`);
console.log(`βx = 1.0 + ${(numeratorX / denominatorX).toFixed(6)}`);
console.log(`βx = ${betaX.toFixed(6)}\n`);

console.log('================================================================================');
console.log('EQUATION 2.2c: Calculate β18 (for standard 18-kip single axle)');
console.log('================================================================================');
console.log('β18 = 1.0 + [3.63(18 + 1)^5.20] / [(D + 1)^8.46 × 1^3.52]\n');

const numerator18 = 3.63 * Math.pow(18 + 1, 5.20);
const denominator18 = Math.pow(testCase.D + 1, 8.46) * Math.pow(1, 3.52);
const beta18 = 1.0 + numerator18 / denominator18;

console.log(`Numerator = 3.63 × (18 + 1)^5.20`);
console.log(`Numerator = 3.63 × 19^5.20`);
console.log(`Numerator = ${numerator18.toFixed(4)}`);
console.log(`\nDenominator = (${testCase.D} + 1)^8.46 × 1^3.52`);
console.log(`Denominator = ${denominator18.toFixed(4)}`);
console.log(`\nβ18 = 1.0 + ${numerator18.toFixed(4)} / ${denominator18.toFixed(4)}`);
console.log(`β18 = 1.0 + ${(numerator18 / denominator18).toFixed(6)}`);
console.log(`β18 = ${beta18.toFixed(6)}\n`);

console.log('================================================================================');
console.log('EQUATION 2.2a: Calculate log(Wtx/Wt18)');
console.log('================================================================================');
console.log('log(Wtx/Wt18) = 5.908 - 4.62log(Lx+L2) + 3.28log(L2) + Gt/βx - Gt/β18\n');

const term1 = 5.908;
const term2 = -4.62 * Math.log10(Lx + L2);
const term3 = 3.28 * Math.log10(L2);
const term4 = Gt / betaX;
const term5 = -Gt / beta18;
const logWtxOverWt18 = term1 + term2 + term3 + term4 + term5;

console.log(`Term 1: 5.908`);
console.log(`Term 2: -4.62 × log₁₀(${Lx.toFixed(4)} + ${L2})`);
console.log(`      = -4.62 × log₁₀(${(Lx + L2).toFixed(4)})`);
console.log(`      = -4.62 × ${Math.log10(Lx + L2).toFixed(6)}`);
console.log(`      = ${term2.toFixed(6)}`);
console.log(`\nTerm 3: 3.28 × log₁₀(${L2})`);
console.log(`      = 3.28 × ${Math.log10(L2).toFixed(6)}`);
console.log(`      = ${term3.toFixed(6)}`);
console.log(`\nTerm 4: Gt/βx`);
console.log(`      = ${Gt.toFixed(6)} / ${betaX.toFixed(6)}`);
console.log(`      = ${term4.toFixed(6)}`);
console.log(`\nTerm 5: -Gt/β18`);
console.log(`      = -${Gt.toFixed(6)} / ${beta18.toFixed(6)}`);
console.log(`      = ${term5.toFixed(6)}`);

console.log(`\nlog(Wtx/Wt18) = ${term1.toFixed(6)} + ${term2.toFixed(6)} + ${term3.toFixed(6)} + ${term4.toFixed(6)} + ${term5.toFixed(6)}`);
console.log(`              = ${logWtxOverWt18.toFixed(6)}\n`);

const WtxOverWt18 = Math.pow(10, logWtxOverWt18);
console.log(`Wtx/Wt18 = 10^${logWtxOverWt18.toFixed(6)}`);
console.log(`Wtx/Wt18 = ${WtxOverWt18.toFixed(6)}`);
console.log(`Wtx/Wt18 = ${WtxOverWt18.toExponential(4)}\n`);

console.log('================================================================================');
console.log('EQUATION 2.2d: Calculate EALF (THE INVERSE!)');
console.log('================================================================================');
console.log('EALF = Wt18/Wtx = 1 / (Wtx/Wt18)\n');

const EALF = 1.0 / WtxOverWt18;
console.log(`EALF = 1 / ${WtxOverWt18.toFixed(6)}`);
console.log(`EALF = ${EALF.toFixed(6)}`);
console.log(`EALF = ${EALF.toExponential(4)}\n`);

console.log('================================================================================');
console.log('ANALYSIS');
console.log('================================================================================\n');

console.log(`✅ RESULT: ${testCase.axleLoadKg} kg (${Lx.toFixed(1)} kips) ${testCase.axleType} axle`);
console.log(`   causes ${EALF.toFixed(2)} equivalent standard axle loads\n`);

if (EALF < 1) {
  console.log(`✓ This axle causes LESS damage than a standard 18-kip single axle.`);
  console.log(`  Wtx/Wt18 = ${WtxOverWt18.toFixed(4)} means this axle can make ${WtxOverWt18.toFixed(2)} passes`);
  console.log(`  to equal one standard 18-kip pass.\n`);
} else {
  console.log(`⚠️  This axle causes MORE damage than a standard 18-kip single axle.`);
  console.log(`  It takes ${EALF.toFixed(2)} standard axle passes to equal the damage from one pass of this axle.\n`);
}

console.log('For reference:');
console.log('- Standard single axle: 18 kips (8,165 kg) → EALF = 1.0');
console.log('- Standard tandem axle: 32 kips (14,515 kg) → EALF ≈ 1.0');
console.log(`- Your test load: ${Lx.toFixed(1)} kips (${testCase.axleLoadKg} kg) = ${(Lx/(L2*18)).toFixed(2)}x standard per axle\n`);

console.log('================================================================================');
console.log('TESTING REASONABLE LOADS');
console.log('================================================================================\n');

const reasonableTests = [
  { load: 8165, type: 'Single', l2: 1, desc: 'Standard single (18 kips)' },
  { load: 10000, type: 'Single', l2: 1, desc: 'Heavy single (22 kips)' },
  { load: 14515, type: 'Tandem', l2: 2, desc: 'Standard tandem (32 kips)' },
  { load: 20000, type: 'Tandem', l2: 2, desc: 'Heavy tandem (44 kips)' },
  { load: 30000, type: 'Tandem', l2: 2, desc: 'Very heavy tandem (66 kips)' }
];

reasonableTests.forEach(test => {
  const lx = test.load * CONSTANTS.KG_TO_KIP;
  const numX = 3.63 * Math.pow(lx + test.l2, 5.20);
  const denX = Math.pow(testCase.D + 1, 8.46) * Math.pow(test.l2, 3.52);
  const bX = 1.0 + numX / denX;
  
  const logR = 5.908 - 
               4.62 * Math.log10(lx + test.l2) + 
               3.28 * Math.log10(test.l2) + 
               Gt / bX - 
               Gt / beta18;
  
  const ratio = Math.pow(10, logR);
  const ealf = 1.0 / ratio;  // THE INVERSE!
  
  console.log(`${test.desc}:`);
  console.log(`  ${test.load} kg = ${lx.toFixed(2)} kips`);
  console.log(`  Wtx/Wt18 = ${ratio.toFixed(4)}, EALF = ${ealf.toFixed(4)}\n`);
});