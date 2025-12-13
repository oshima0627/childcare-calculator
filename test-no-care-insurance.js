/**
 * 介護保険料削除後の動作確認テスト
 */

const { calculate, validateInput } = require('./app/utils/calculator.js')

// テストケース1: 標準的な給与30万円
console.log('=== 介護保険料削除後のテスト ===\n')

const testInput = { salary: 300000 }
console.log('入力値:', testInput)

try {
  const result = calculate(testInput)
  console.log('\n✅ 計算成功')
  
  console.log('\n現在の収支:')
  console.log(`総支給額: ${result.current.grossSalary.toLocaleString()}円`)
  console.log(`健康保険料: ${result.current.socialInsurance.healthInsurance.toLocaleString()}円`)
  console.log(`厚生年金保険料: ${result.current.socialInsurance.pensionInsurance.toLocaleString()}円`)
  console.log(`雇用保険料: ${result.current.socialInsurance.employmentInsurance.toLocaleString()}円`)
  console.log(`社会保険料合計: ${result.current.socialInsurance.total.toLocaleString()}円`)
  console.log(`手取り額: ${result.current.netIncome.toLocaleString()}円`)
  
  console.log('\n育児休業給付金:')
  console.log(`賃金日額: ${result.childcare.dailyWage.toLocaleString()}円`)
  console.log(`1-6ヶ月(67%): ${result.childcare.monthlyBenefits[0].benefit.toLocaleString()}円`)
  console.log(`7-12ヶ月(50%): ${result.childcare.monthlyBenefits[11].benefit.toLocaleString()}円`)
  
  // 介護保険料が含まれていないことを確認
  if (result.current.socialInsurance.careInsurance !== undefined) {
    console.log('\n❌ エラー: careInsuranceプロパティがまだ存在しています')
  } else {
    console.log('\n✅ 成功: careInsuranceプロパティが削除されています')
  }
  
} catch (error) {
  console.log('\n❌ エラーが発生:', error.message)
  console.log(error.stack)
}

// バリデーションテスト
console.log('\n=== バリデーションテスト ===')
const testCases = [
  { salary: 0, expected: 'error' },
  { salary: 50000, expected: 'warning' },
  { salary: 300000, expected: null },
  { salary: 2500000, expected: 'error' }
]

testCases.forEach(testCase => {
  const validation = validateInput(testCase.salary)
  console.log(`給与${testCase.salary}: ${validation ? validation.type : 'OK'}`)
})

console.log('\n=== テスト完了 ===')