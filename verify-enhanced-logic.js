/**
 * 出生後休業支援給付金の計算ロジック詳細検証
 */

const testSalaries = [200000, 300000, 400000, 500000, 600000];

console.log('=== 出生後休業支援給付金 計算ロジック検証 ===');
console.log('');

// 問題の洗い出し
const issues = [];

testSalaries.forEach(salary => {
  console.log('💰 月給: ' + salary.toLocaleString() + '円');
  
  // 賃金日額計算
  const dailyWage = Math.floor((salary * 6) / 180);
  console.log('賃金日額: ' + dailyWage.toLocaleString() + '円');
  
  // 上限チェック（重要な問題点）
  const ENHANCED_LIMIT = 15690;  // 出生後休業支援給付金の上限
  const NORMAL_LIMIT = 16110;    // 通常の育児休業給付金の上限
  
  const isEnhancedUpperLimit = dailyWage > ENHANCED_LIMIT;
  const isNormalUpperLimit = dailyWage > NORMAL_LIMIT;
  
  const actualDailyWageEnhanced = isEnhancedUpperLimit ? ENHANCED_LIMIT : dailyWage;
  const actualDailyWageNormal = isNormalUpperLimit ? NORMAL_LIMIT : dailyWage;
  
  console.log('出生後制度上限適用: ' + (isEnhancedUpperLimit ? 'Yes (' + ENHANCED_LIMIT.toLocaleString() + '円)' : 'No'));
  console.log('通常制度上限適用: ' + (isNormalUpperLimit ? 'Yes (' + NORMAL_LIMIT.toLocaleString() + '円)' : 'No'));
  
  // 問題1: 異なる上限額による賃金日額の不整合
  if (actualDailyWageEnhanced !== actualDailyWageNormal) {
    const issue = '⚠️ 問題1: 異なる上限額により賃金日額が不一致';
    console.log(issue);
    console.log('  出生後制度: ' + actualDailyWageEnhanced.toLocaleString() + '円');
    console.log('  通常制度: ' + actualDailyWageNormal.toLocaleString() + '円');
    issues.push(issue + ' (月給: ' + salary.toLocaleString() + '円)');
  }
  
  // 給付金計算
  const benefit80_28days = Math.floor(actualDailyWageEnhanced * 28 * 0.80);
  const benefit67_28days = Math.floor(actualDailyWageNormal * 28 * 0.67);
  const enhancement = benefit80_28days - benefit67_28days;
  
  console.log('80%給付(28日): ' + benefit80_28days.toLocaleString() + '円');
  console.log('67%給付(28日): ' + benefit67_28days.toLocaleString() + '円');
  console.log('上乗せ額: ' + enhancement.toLocaleString() + '円');
  
  // 問題2: 月額上限の適用方法
  const ENHANCED_MONTHLY_LIMIT = 376200; // 80%の月額上限
  const NORMAL_MONTHLY_LIMIT = 323811;   // 67%の月額上限
  
  const benefit80_monthly = Math.floor(actualDailyWageEnhanced * 30 * 0.80);
  const benefit67_monthly = Math.floor(actualDailyWageNormal * 30 * 0.67);
  
  const cappedBenefit80 = Math.min(benefit80_monthly, ENHANCED_MONTHLY_LIMIT);
  const cappedBenefit67 = Math.min(benefit67_monthly, NORMAL_MONTHLY_LIMIT);
  
  if (benefit80_monthly !== cappedBenefit80) {
    const issue = '⚠️ 問題2: 80%給付で月額上限適用';
    console.log(issue + ' (' + benefit80_monthly.toLocaleString() + '→' + cappedBenefit80.toLocaleString() + ')');
    issues.push(issue + ' (月給: ' + salary.toLocaleString() + '円)');
  }
  
  if (benefit67_monthly !== cappedBenefit67) {
    const issue = '⚠️ 問題3: 67%給付で月額上限適用';
    console.log(issue + ' (' + benefit67_monthly.toLocaleString() + '→' + cappedBenefit67.toLocaleString() + ')');
    issues.push(issue + ' (月給: ' + salary.toLocaleString() + '円)');
  }
  
  // 問題3: 現在の実装での28日間按分計算
  const currentImpl_enhancement = Math.floor((cappedBenefit80 - cappedBenefit67) * (28 / 30));
  const correct_enhancement = Math.floor(cappedBenefit80 * 28 / 30) - Math.floor(cappedBenefit67 * 28 / 30);
  
  if (currentImpl_enhancement !== correct_enhancement) {
    const issue = '⚠️ 問題4: 按分計算の誤差';
    console.log(issue);
    console.log('  現在の実装: ' + currentImpl_enhancement.toLocaleString() + '円');
    console.log('  正しい計算: ' + correct_enhancement.toLocaleString() + '円');
    console.log('  誤差: ' + (correct_enhancement - currentImpl_enhancement).toLocaleString() + '円');
    issues.push(issue + ' (月給: ' + salary.toLocaleString() + '円)');
  }
  
  console.log('');
  console.log('='.repeat(50));
  console.log('');
});

console.log('🔍 発見された問題の総括:');
console.log('');
issues.forEach((issue, index) => {
  console.log((index + 1) + '. ' + issue);
});

if (issues.length === 0) {
  console.log('✅ 計算ロジックに問題は発見されませんでした。');
} else {
  console.log('');
  console.log('📋 修正が必要な項目:');
  console.log('1. 賃金日額の統一（同じ制度内での一貫性）');
  console.log('2. 月額上限の正確な適用');
  console.log('3. 28日間按分計算の精度向上');
  console.log('4. 異なる制度間での比較方法の見直し');
}

// 制度理解の確認
console.log('');
console.log('📖 制度理解の確認:');
console.log('・出生後休業支援給付金は独立した制度');
console.log('・賃金日額上限: 15,690円（通常より低い）');
console.log('・月額上限: 376,200円（80%給付用）');
console.log('・適用期間: 28日間のみ');
console.log('・比較対象: 同期間の通常給付との差額');