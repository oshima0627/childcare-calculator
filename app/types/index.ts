/**
 * 育児休業給付金シミュレーターの型定義
 */

// 入力値の型
export interface CalculatorInput {
  salary: number
  age: 'under40' | 'over40'
}

// 社会保険料の型
export interface SocialInsurance {
  healthInsurance: number      // 健康保険料
  careInsurance: number        // 介護保険料(40歳以上のみ)
  pensionInsurance: number     // 厚生年金保険料
  employmentInsurance: number  // 雇用保険料
  total: number                // 合計
}

// 税金の型
export interface Tax {
  incomeTax: number            // 所得税(概算)
  residentTax: number          // 住民税(概算)
  total: number                // 合計
}

// 現在の収支の型
export interface CurrentIncome {
  grossSalary: number          // 月額総支給額
  socialInsurance: SocialInsurance
  tax: Tax
  netIncome: number            // 手取り額
}

// 月別給付金の型
export interface MonthlyBenefit {
  month: number                // 月(1-12)
  benefit: number              // その月の給付金額
  cumulative: number           // 累計給付金額
}

// 育休給付金の型
export interface ChildcareBenefit {
  dailyWage: number            // 賃金日額
  isUpperLimit: boolean        // 上限額適用フラグ
  monthlyBenefits: MonthlyBenefit[]  // 12ヶ月分の詳細
  total: number                // 12ヶ月合計
}

// 出生後休業支援給付金の型
export interface EnhancedBenefit {
  dailyWage: number                 // 賃金日額
  isUpperLimit: boolean             // 上限適用フラグ
  enhancementPeriod: number         // 80%給付期間（日数）
  monthlyBenefit80Percent: number   // 最初の28日間の月額給付金(80%)
  monthlyBenefit67Percent: number   // 29日目以降の月額給付金(67%)
  totalEnhancement: number          // 28日間での上乗せ額
  yearlyEnhancement: number         // 年間の上乗せ総額
}

// 計算結果全体の型
export interface CalculationResult {
  input: CalculatorInput
  current: CurrentIncome
  childcare: ChildcareBenefit
  enhancedBenefit: EnhancedBenefit  // 出生後休業支援給付金
  maintenanceRate6Months: number   // 1-6ヶ月の維持率(%)
  maintenanceRate12Months: number  // 7-12ヶ月の維持率(%)
  enhancedMaintenanceRate: number  // 80%給付時の維持率(%)
}

// バリデーションエラーの型
export interface ValidationError {
  field: 'salary' | 'age'
  message: string
  type: 'error' | 'warning'
}

// InputForm コンポーネントの Props
export interface InputFormProps {
  onCalculate: (input: CalculatorInput) => void
  initialSalary?: number
  initialAge?: 'under40' | 'over40'
}

// ResultDisplay コンポーネントの Props
export interface ResultDisplayProps {
  result: CalculationResult
}

// ComparisonChart コンポーネントの Props
export interface ComparisonChartProps {
  result: CalculationResult
}

// CurrentIncome コンポーネントの Props
export interface CurrentIncomeProps {
  current: CurrentIncome
}

// ChildcareIncome コンポーネントの Props
export interface ChildcareIncomeProps {
  childcare: ChildcareBenefit
  maintenanceRate6: number
  maintenanceRate12: number
}

// MonthlyTable コンポーネントの Props
export interface MonthlyTableProps {
  monthlyBenefits: MonthlyBenefit[]
}

// SocialShare コンポーネントの Props
export interface SocialShareProps {
  url: string
  title: string
}

// FAQ データの型
export interface FAQItem {
  question: string
  answer: string
  source?: string
}