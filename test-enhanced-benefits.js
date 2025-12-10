/**
 * 出生後休業支援給付金の計算テスト
 */

// 定数
const ENHANCED_BENEFIT_LIMITS = {
  dailyWageLimit: 15690,
  monthly80Percent: 376200,
  enhancementPeriodDays: 28,
};

const CHILDCARE_BENEFIT_LIMITS = {
  dailyWageLimit: 16110,
  monthly67Percent: 323811,
};

const BENEFIT_RATES = {
  first6Months: 0.67,
  enhanced: 0.80,
};

// 出生後休業支援給付金計算
function calculateEnhancedBenefit(salary) {
  const dailyWage = Math.floor((salary * 6) / 180);
  const isUpperLimit = dailyWage > ENHANCED_BENEFIT_LIMITS.dailyWageLimit;
  const actualDailyWage = isUpperLimit ? ENHANCED_BENEFIT_LIMITS.dailyWageLimit : dailyWage;
  
  // 80%給付（28日間）
  const monthlyBenefit80Percent = Math.floor(actualDailyWage * 30 * BENEFIT_RATES.enhanced);
  const cappedMonthlyBenefit80Percent = Math.min(monthlyBenefit80Percent, ENHANCED_BENEFIT_LIMITS.monthly80Percent);
  
  // 67%給付（通常）
  const monthlyBenefit67Percent = Math.floor(actualDailyWage * 30 * BENEFIT_RATES.first6Months);
  const cappedMonthlyBenefit67Percent = Math.min(monthlyBenefit67Percent, CHILDCARE_BENEFIT_LIMITS.monthly67Percent);
  
  // 28日間の上乗せ額
  const enhancementDays = ENHANCED_BENEFIT_LIMITS.enhancementPeriodDays;
  const totalEnhancement = Math.floor((cappedMonthlyBenefit80Percent - cappedMonthlyBenefit67Percent) * (enhancementDays / 30));
  
  return {
    dailyWage: actualDailyWage,
    isUpperLimit,
    enhancementPeriod: enhancementDays,
    monthlyBenefit80Percent: cappedMonthlyBenefit80Percent,
    monthlyBenefit67Percent: cappedMonthlyBenefit67Percent,
    totalEnhancement,
    yearlyEnhancement: totalEnhancement,
  };
}

// テストケース
const testCases = [
  { salary: 200000, description: '月給20万円' },
  { salary: 300000, description: '月給30万円' },
  { salary: 400000, description: '月給40万円' },
  { salary: 500000, description: '月給50万円（上限テスト）' },
  { salary: 600000, description: '月給60万円（上限超過テスト）' },
];

console.log('=== 出生後休業支援給付金 計算テスト ===\n');

testCases.forEach((testCase, index) => {
  console.log(`テストケース ${index + 1}: ${testCase.description}`);
  console.log('-------------------------------------------');
  
  const enhancedBenefit = calculateEnhancedBenefit(testCase.salary);
  
  console.log(`月額総支給額: ${testCase.salary.toLocaleString()}円`);
  console.log(`賃金日額: ${enhancedBenefit.dailyWage.toLocaleString()}円${enhancedBenefit.isUpperLimit ? ' (上限適用)' : ''}`);
  console.log('');
  
  console.log('💰 給付金額:');
  console.log(`  最初の28日間(80%): ${enhancedBenefit.monthlyBenefit80Percent.toLocaleString()}円/月`);
  console.log(`  29日目以降(67%): ${enhancedBenefit.monthlyBenefit67Percent.toLocaleString()}円/月`);
  console.log('');
  
  console.log('📊 上乗せ効果:');
  console.log(`  28日間の上乗せ額: +${enhancedBenefit.totalEnhancement.toLocaleString()}円`);
  console.log(`  上乗せ率: +${((enhancedBenefit.monthlyBenefit80Percent / enhancedBenefit.monthlyBenefit67Percent - 1) * 100).toFixed(1)}%`);
  console.log('');
  
  // 通常給付との比較
  const normalBenefit = enhancedBenefit.monthlyBenefit67Percent;
  const enhancedRate = Math.round((enhancedBenefit.totalEnhancement / normalBenefit) * 100);
  
  console.log('🔍 効果分析:');
  console.log(`  通常給付に対する上乗せ効果: ${enhancedRate}%`);
  console.log(`  実質的な給付率向上: 67% → 80% (28日間)`);
  
  console.log('\n===========================================\n');
});

console.log('✅ 出生後休業支援給付金の計算テストが完了しました。');
console.log('🌟 配偶者も育休を取得することで、最初の28日間は13%の上乗せ給付を受けられます！');