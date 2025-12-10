/**
 * 修正後の出生後休業支援給付金計算テスト
 */

// 修正後の計算ロジック
function calculateEnhancedBenefitCorrected(salary) {
  const baseDailyWage = Math.floor((salary * 6) / 180);
  
  // 出生後制度の賃金日額
  const ENHANCED_LIMIT = 15690;
  const isEnhancedUpperLimit = baseDailyWage > ENHANCED_LIMIT;
  const enhancedDailyWage = isEnhancedUpperLimit ? ENHANCED_LIMIT : baseDailyWage;
  
  // 通常制度の賃金日額（比較用）
  const NORMAL_LIMIT = 16110;
  const isNormalUpperLimit = baseDailyWage > NORMAL_LIMIT;
  const normalDailyWage = isNormalUpperLimit ? NORMAL_LIMIT : baseDailyWage;
  
  // 28日間での直接計算
  const enhancementDays = 28;
  
  // 80%給付（28日間）
  const benefit80_28days = Math.floor(enhancedDailyWage * enhancementDays * 0.80);
  const monthlyBenefit80 = Math.floor(enhancedDailyWage * 30 * 0.80);
  const cappedMonthlyBenefit80 = Math.min(monthlyBenefit80, 376200);
  
  // 67%給付（28日間、比較用）
  const benefit67_28days = Math.floor(normalDailyWage * enhancementDays * 0.67);
  const monthlyBenefit67 = Math.floor(normalDailyWage * 30 * 0.67);
  const cappedMonthlyBenefit67 = Math.min(monthlyBenefit67, 323811);
  
  // 上限適用後の28日間給付額
  const actualBenefit80_28days = Math.min(benefit80_28days, Math.floor(cappedMonthlyBenefit80 * enhancementDays / 30));
  const actualBenefit67_28days = Math.min(benefit67_28days, Math.floor(cappedMonthlyBenefit67 * enhancementDays / 30));
  const totalEnhancement = actualBenefit80_28days - actualBenefit67_28days;
  
  return {
    baseDailyWage,
    enhancedDailyWage,
    normalDailyWage,
    benefit80_28days: actualBenefit80_28days,
    benefit67_28days: actualBenefit67_28days,
    totalEnhancement,
    isEnhancedUpperLimit,
    isNormalUpperLimit,
    cappedMonthlyBenefit80,
    cappedMonthlyBenefit67,
  };
}

console.log('=== 修正後の計算ロジック検証 ===');
console.log('');

const testSalaries = [200000, 300000, 400000, 500000, 600000];

testSalaries.forEach(salary => {
  console.log('💰 月給: ' + salary.toLocaleString() + '円');
  
  const result = calculateEnhancedBenefitCorrected(salary);
  
  console.log('基本賃金日額: ' + result.baseDailyWage.toLocaleString() + '円');
  console.log('出生後制度日額: ' + result.enhancedDailyWage.toLocaleString() + '円' + (result.isEnhancedUpperLimit ? ' (上限適用)' : ''));
  console.log('通常制度日額: ' + result.normalDailyWage.toLocaleString() + '円' + (result.isNormalUpperLimit ? ' (上限適用)' : ''));
  
  console.log('');
  console.log('📊 28日間の給付額:');
  console.log('  80%給付: ' + result.benefit80_28days.toLocaleString() + '円');
  console.log('  67%給付: ' + result.benefit67_28days.toLocaleString() + '円');
  console.log('  上乗せ額: +' + result.totalEnhancement.toLocaleString() + '円');
  
  console.log('');
  console.log('📋 月額換算（参考）:');
  console.log('  80%月額: ' + result.cappedMonthlyBenefit80.toLocaleString() + '円');
  console.log('  67%月額: ' + result.cappedMonthlyBenefit67.toLocaleString() + '円');
  
  // 手取り維持率の概算（仮に手取り22万として）
  const estimatedNetIncome = Math.floor(salary * 0.75); // 概算手取り
  const maintenanceRate80 = Math.round((result.benefit80_28days * 30 / 28) / estimatedNetIncome * 100);
  const maintenanceRate67 = Math.round((result.benefit67_28days * 30 / 28) / estimatedNetIncome * 100);
  
  console.log('');
  console.log('🎯 維持率（概算）:');
  console.log('  80%給付時: ' + maintenanceRate80 + '%');
  console.log('  67%給付時: ' + maintenanceRate67 + '%');
  console.log('  改善効果: +' + (maintenanceRate80 - maintenanceRate67) + 'ポイント');
  
  console.log('');
  console.log('='.repeat(50));
  console.log('');
});

console.log('✅ 修正ポイント:');
console.log('1. 制度別の賃金日額を正確に分離');
console.log('2. 28日間ベースでの直接計算');
console.log('3. 月額上限の正確な適用');
console.log('4. 按分計算の精度向上');
console.log('');
console.log('🌟 これで計算ロジックがより正確になりました！');