/**
 * 計算ロジックのテスト
 * 手動テストケースで計算結果の妥当性を確認
 */

// 必要なモジュールのインポート（Node.js環境用）
const fs = require('fs');
const path = require('path');

// 定数の読み込み（簡易版）
const STANDARD_MONTHLY_REMUNERATION_TABLE = [
  58000, 68000, 78000, 88000, 98000,
  104000, 110000, 118000, 126000, 134000,
  142000, 150000, 160000, 170000, 180000,
  190000, 200000, 220000, 240000, 260000,
  280000, 300000, 320000, 340000, 360000,
  380000, 410000, 440000, 470000, 500000,
  530000, 560000, 590000, 620000, 650000,
  680000, 710000, 750000, 790000, 830000,
  880000, 930000, 980000, 1030000, 1090000,
  1150000, 1210000, 1270000, 1330000, 1390000,
];

const INSURANCE_RATES = {
  health: 0.10,
  pension: 0.183,
  employment: 0.006,
};

const TAX_CONSTANTS = {
  basicDeduction: 480000,
  residentBasicDeduction: 430000,
  residentEqualTax: 5000,
  salaryDeductionRate: 0.2,
  salaryDeductionMin: 550000,
};

const CHILDCARE_BENEFIT_LIMITS = {
  dailyWageLimit: 16110,
  monthly67Percent: 323811,
  monthly50Percent: 241650,
};

const BENEFIT_RATES = {
  first6Months: 0.67,
  after7Months: 0.50,
};

// 計算関数（TypeScriptからJavaScriptに変換）
function getStandardMonthlyRemuneration(salary) {
  if (salary < STANDARD_MONTHLY_REMUNERATION_TABLE[0]) {
    return STANDARD_MONTHLY_REMUNERATION_TABLE[0];
  }
  
  const maxRemuneration = STANDARD_MONTHLY_REMUNERATION_TABLE[
    STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1
  ];
  if (salary >= maxRemuneration) {
    return maxRemuneration;
  }
  
  for (let i = 0; i < STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1; i++) {
    const current = STANDARD_MONTHLY_REMUNERATION_TABLE[i];
    const next = STANDARD_MONTHLY_REMUNERATION_TABLE[i + 1];
    const midpoint = (current + next) / 2;
    
    if (salary < midpoint) {
      return current;
    }
  }
  
  return maxRemuneration;
}

function calculateSocialInsurance(salary) {
  const standardRemuneration = getStandardMonthlyRemuneration(salary);
  
  const healthInsurance = Math.floor(standardRemuneration * INSURANCE_RATES.health / 2);
  const pensionInsurance = Math.floor(standardRemuneration * INSURANCE_RATES.pension / 2);
  const employmentInsurance = Math.floor(salary * INSURANCE_RATES.employment);
  
  const total = healthInsurance + pensionInsurance + employmentInsurance;
  
  return {
    healthInsurance,
    pensionInsurance,
    employmentInsurance,
    total,
  };
}

function calculateTax(salary) {
  const annualSalary = salary * 12;
  
  const salaryDeduction = Math.max(
    TAX_CONSTANTS.salaryDeductionMin,
    Math.min(annualSalary * TAX_CONSTANTS.salaryDeductionRate, 1950000 * TAX_CONSTANTS.salaryDeductionRate)
  );
  const taxableIncome = Math.max(0, annualSalary - salaryDeduction - TAX_CONSTANTS.basicDeduction);
  
  let annualIncomeTax = 0;
  if (taxableIncome <= 1950000) {
    annualIncomeTax = taxableIncome * 0.05;
  } else if (taxableIncome <= 3300000) {
    annualIncomeTax = 97500 + (taxableIncome - 1950000) * 0.10;
  } else if (taxableIncome <= 6950000) {
    annualIncomeTax = 232500 + (taxableIncome - 3300000) * 0.20;
  } else {
    annualIncomeTax = 962500 + (taxableIncome - 6950000) * 0.23;
  }
  
  const monthlyIncomeTax = Math.floor(annualIncomeTax / 12);
  
  const residentTaxBase = Math.max(0, taxableIncome - (TAX_CONSTANTS.residentBasicDeduction - TAX_CONSTANTS.basicDeduction));
  const annualResidentTax = TAX_CONSTANTS.residentEqualTax + (residentTaxBase * 0.10);
  const monthlyResidentTax = Math.floor(annualResidentTax / 12);
  
  return {
    incomeTax: monthlyIncomeTax,
    residentTax: monthlyResidentTax,
    total: monthlyIncomeTax + monthlyResidentTax,
  };
}

function calculateChildcareBenefit(salary) {
  const dailyWage = Math.floor((salary * 6) / 180);
  const isUpperLimit = dailyWage > CHILDCARE_BENEFIT_LIMITS.dailyWageLimit;
  const actualDailyWage = isUpperLimit ? CHILDCARE_BENEFIT_LIMITS.dailyWageLimit : dailyWage;
  
  const monthlyBenefits = [];
  let cumulative = 0;
  
  for (let month = 1; month <= 12; month++) {
    let benefit;
    
    if (month <= 6) {
      benefit = Math.floor(actualDailyWage * 30 * BENEFIT_RATES.first6Months);
      if (benefit > CHILDCARE_BENEFIT_LIMITS.monthly67Percent) {
        benefit = CHILDCARE_BENEFIT_LIMITS.monthly67Percent;
      }
    } else {
      benefit = Math.floor(actualDailyWage * 30 * BENEFIT_RATES.after7Months);
      if (benefit > CHILDCARE_BENEFIT_LIMITS.monthly50Percent) {
        benefit = CHILDCARE_BENEFIT_LIMITS.monthly50Percent;
      }
    }
    
    cumulative += benefit;
    monthlyBenefits.push({ month, benefit, cumulative });
  }
  
  return {
    dailyWage: actualDailyWage,
    isUpperLimit,
    monthlyBenefits,
    total: cumulative,
  };
}

// テストケース
const testCases = [
  { salary: 200000, description: '月給20万円' },
  { salary: 300000, description: '月給30万円' },
  { salary: 400000, description: '月給40万円' },
  { salary: 500000, description: '月給50万円（上限テスト）' },
];

console.log('=== 育児休業給付金シミュレーター 計算テスト ===\n');

testCases.forEach((testCase, index) => {
  console.log(`テストケース ${index + 1}: ${testCase.description}`);
  console.log('-------------------------------------------');
  
  const socialInsurance = calculateSocialInsurance(testCase.salary);
  const tax = calculateTax(testCase.salary);
  const childcare = calculateChildcareBenefit(testCase.salary);
  const netIncome = testCase.salary - socialInsurance.total - tax.total;
  
  console.log(`月額総支給額: ${testCase.salary.toLocaleString()}円`);
  console.log(`標準報酬月額: ${getStandardMonthlyRemuneration(testCase.salary).toLocaleString()}円`);
  console.log('');
  
  console.log('社会保険料:');
  console.log(`  健康保険: ${socialInsurance.healthInsurance.toLocaleString()}円`);
  console.log(`  厚生年金: ${socialInsurance.pensionInsurance.toLocaleString()}円`);
  console.log(`  雇用保険: ${socialInsurance.employmentInsurance.toLocaleString()}円`);
  console.log(`  合計: ${socialInsurance.total.toLocaleString()}円`);
  console.log('');
  
  console.log('税金:');
  console.log(`  所得税: ${tax.incomeTax.toLocaleString()}円`);
  console.log(`  住民税: ${tax.residentTax.toLocaleString()}円`);
  console.log(`  合計: ${tax.total.toLocaleString()}円`);
  console.log('');
  
  console.log(`手取り額: ${netIncome.toLocaleString()}円`);
  console.log('');
  
  console.log('育児休業給付金:');
  console.log(`  賃金日額: ${childcare.dailyWage.toLocaleString()}円${childcare.isUpperLimit ? ' (上限適用)' : ''}`);
  console.log(`  1-6ヶ月目: ${childcare.monthlyBenefits[0].benefit.toLocaleString()}円/月`);
  console.log(`  7-12ヶ月目: ${childcare.monthlyBenefits[11].benefit.toLocaleString()}円/月`);
  console.log(`  12ヶ月合計: ${childcare.total.toLocaleString()}円`);
  console.log('');
  
  const maintenanceRate6 = Math.round((childcare.monthlyBenefits[0].benefit / netIncome) * 100);
  const maintenanceRate12 = Math.round((childcare.monthlyBenefits[11].benefit / netIncome) * 100);
  console.log(`手取り維持率: 1-6ヶ月目 ${maintenanceRate6}%, 7-12ヶ月目 ${maintenanceRate12}%`);
  
  console.log('\n===========================================\n');
});

console.log('✅ 全ての計算テストが完了しました。');
console.log('🔍 計算結果の妥当性を確認してください。');