/**
 * 修正された税金計算の簡易テスト
 */

console.log('修正された税金計算のテスト');

// 税金計算の定数を模擬
const TAX_CONSTANTS = {
  basicDeduction: 480000,
  residentBasicDeduction: 430000,
  residentEqualTax: 5000,
  residentIncomeRate: 0.10,
  salaryDeductionRanges: [
    { max: 1625000, rate: 0, fixed: 550000 },
    { max: 1800000, rate: 0.4, deduction: 100000 },
    { max: 3600000, rate: 0.3, deduction: 80000 },
    { max: 6600000, rate: 0.2, deduction: 440000 },
    { max: 8500000, rate: 0.1, deduction: 1100000 },
    { max: Infinity, rate: 0, fixed: 1950000 }
  ],
  incomeTaxRanges: [
    { max: 1950000, rate: 0.05, deduction: 0 },
    { max: 3300000, rate: 0.10, deduction: 97500 },
    { max: 6950000, rate: 0.20, deduction: 427500 },
    { max: 9000000, rate: 0.23, deduction: 636000 },
    { max: 18000000, rate: 0.33, deduction: 1536000 },
    { max: 40000000, rate: 0.40, deduction: 2796000 },
    { max: Infinity, rate: 0.45, deduction: 4796000 }
  ]
};

// 社会保険料率
const INSURANCE_RATES = {
  health: 0.10,
  pension: 0.183,
  employment: 0.006,
};

function calculateSalaryDeduction(annualSalary) {
  for (const range of TAX_CONSTANTS.salaryDeductionRanges) {
    if (annualSalary <= range.max) {
      if (range.fixed !== undefined) {
        return range.fixed;
      } else {
        return Math.floor(annualSalary * range.rate - range.deduction);
      }
    }
  }
  return 1950000;
}

function calculateIncomeTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;
  
  for (const range of TAX_CONSTANTS.incomeTaxRanges) {
    if (taxableIncome <= range.max) {
      const tax = Math.floor(taxableIncome * range.rate - range.deduction);
      return Math.floor(tax * 1.021);
    }
  }
  return 0;
}

// テストケース: 月給30万円
const salary = 300000;
const annualSalary = salary * 12; // 360万円

// 社会保険料計算（簡易）
const healthInsurance = Math.floor(salary * INSURANCE_RATES.health / 2);
const pensionInsurance = Math.floor(salary * INSURANCE_RATES.pension / 2);
const employmentInsurance = Math.floor(salary * INSURANCE_RATES.employment);
const totalSocialInsurance = healthInsurance + pensionInsurance + employmentInsurance;
const annualSocialInsurance = totalSocialInsurance * 12;

// 1. 給与所得控除
const salaryDeduction = calculateSalaryDeduction(annualSalary);
const salaryIncome = Math.max(0, annualSalary - salaryDeduction);

// 2. 所得控除
const totalDeductions = TAX_CONSTANTS.basicDeduction + annualSocialInsurance;

// 3. 課税所得（所得税）
const taxableIncomeForIncomeTax = Math.max(0, salaryIncome - totalDeductions);

// 4. 所得税
const annualIncomeTax = calculateIncomeTax(taxableIncomeForIncomeTax);

// 5. 住民税
const residentTaxDeductions = TAX_CONSTANTS.residentBasicDeduction + annualSocialInsurance;
const taxableIncomeForResidentTax = Math.max(0, salaryIncome - residentTaxDeductions);
const annualResidentTax = TAX_CONSTANTS.residentEqualTax + 
  Math.floor(taxableIncomeForResidentTax * TAX_CONSTANTS.residentIncomeRate);

// 月額変換
const monthlyIncomeTax = Math.floor(annualIncomeTax / 12);
const monthlyResidentTax = Math.floor(annualResidentTax / 12);
const totalTax = monthlyIncomeTax + monthlyResidentTax;

// 手取り計算
const netIncome = salary - totalSocialInsurance - totalTax;

console.log('\n=== 月給30万円、40歳未満の場合 ===');
console.log(`月額総支給額: ${salary.toLocaleString()}円`);
console.log(`年収: ${annualSalary.toLocaleString()}円`);
console.log(`\n【所得控除】`);
console.log(`給与所得控除: ${salaryDeduction.toLocaleString()}円`);
console.log(`給与所得: ${salaryIncome.toLocaleString()}円`);
console.log(`社会保険料控除（年額）: ${annualSocialInsurance.toLocaleString()}円`);
console.log(`基礎控除: ${TAX_CONSTANTS.basicDeduction.toLocaleString()}円`);
console.log(`\n【税金計算】`);
console.log(`課税所得（所得税）: ${taxableIncomeForIncomeTax.toLocaleString()}円`);
console.log(`課税所得（住民税）: ${taxableIncomeForResidentTax.toLocaleString()}円`);
console.log(`所得税（年額）: ${annualIncomeTax.toLocaleString()}円`);
console.log(`住民税（年額）: ${annualResidentTax.toLocaleString()}円`);
console.log(`\n【月額計算】`);
console.log(`社会保険料（月額）: ${totalSocialInsurance.toLocaleString()}円`);
console.log(`所得税（月額）: ${monthlyIncomeTax.toLocaleString()}円`);
console.log(`住民税（月額）: ${monthlyResidentTax.toLocaleString()}円`);
console.log(`税金合計（月額）: ${totalTax.toLocaleString()}円`);
console.log(`手取り額: ${netIncome.toLocaleString()}円`);

console.log(`\n手取り率: ${Math.round((netIncome / salary) * 100)}%`);