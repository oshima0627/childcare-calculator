/**
 * 育児休業給付金計算ロジック
 * 厚生労働省の公式な計算方法に基づく
 */

import {
  STANDARD_MONTHLY_REMUNERATION_TABLE,
  INSURANCE_RATES,
  TAX_CONSTANTS,
  CHILDCARE_BENEFIT_LIMITS,
  ENHANCED_BENEFIT_LIMITS,
  BENEFIT_RATES,
  VALIDATION_LIMITS,
} from './constants'
import type {
  CalculatorInput,
  CalculationResult,
  CurrentIncome,
  ChildcareBenefit,
  EnhancedBenefit,
  MonthlyBenefit,
  SocialInsurance,
  Tax,
  ValidationError,
} from '../types'

/**
 * 標準報酬月額を取得
 * 月額総支給額を標準報酬月額等級表から最も近い等級に変換
 * @param salary 月額総支給額
 * @returns 標準報酬月額
 */
function getStandardMonthlyRemuneration(salary: number): number {
  // 最小値より小さい場合
  if (salary < STANDARD_MONTHLY_REMUNERATION_TABLE[0]) {
    return STANDARD_MONTHLY_REMUNERATION_TABLE[0]
  }
  
  // 最大値より大きい場合
  const maxRemuneration = STANDARD_MONTHLY_REMUNERATION_TABLE[
    STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1
  ]
  if (salary >= maxRemuneration) {
    return maxRemuneration
  }
  
  // 該当する等級を探す
  for (let i = 0; i < STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1; i++) {
    const current = STANDARD_MONTHLY_REMUNERATION_TABLE[i]
    const next = STANDARD_MONTHLY_REMUNERATION_TABLE[i + 1]
    
    // 現在の等級と次の等級の中間値
    const midpoint = (current + next) / 2
    
    if (salary < midpoint) {
      return current
    }
  }
  
  return maxRemuneration
}

/**
 * 社会保険料を計算
 * @param salary 月額総支給額
 * @param age 年齢区分
 * @returns 社会保険料の詳細
 */
function calculateSocialInsurance(
  salary: number,
  age: 'under40' | 'over40'
): SocialInsurance {
  const standardRemuneration = getStandardMonthlyRemuneration(salary)
  
  // 健康保険料(労働者負担分)
  const healthInsurance = Math.floor(
    standardRemuneration * INSURANCE_RATES.health / 2
  )
  
  // 介護保険料(40歳以上のみ、労働者負担分)
  const careInsurance = age === 'over40'
    ? Math.floor(standardRemuneration * INSURANCE_RATES.care / 2)
    : 0
  
  // 厚生年金保険料(労働者負担分)
  const pensionInsurance = Math.floor(
    standardRemuneration * INSURANCE_RATES.pension / 2
  )
  
  // 雇用保険料(労働者負担分)
  const employmentInsurance = Math.floor(
    salary * INSURANCE_RATES.employment
  )
  
  const total = healthInsurance + careInsurance + pensionInsurance + employmentInsurance
  
  return {
    healthInsurance,
    careInsurance,
    pensionInsurance,
    employmentInsurance,
    total,
  }
}

/**
 * 税金を計算(概算)
 * 所得税は年収ベースで計算し12で割る、住民税は前年所得ベースの概算
 * @param salary 月額総支給額
 * @returns 税金の詳細
 */
function calculateTax(salary: number): Tax {
  const annualSalary = salary * 12
  
  // 所得税計算（年額ベース）
  // 給与所得控除: 年収195万円以下の場合は最低55万円
  const salaryDeduction = Math.max(
    TAX_CONSTANTS.salaryDeductionMin,
    Math.min(annualSalary * TAX_CONSTANTS.salaryDeductionRate, 1950000 * TAX_CONSTANTS.salaryDeductionRate)
  )
  const taxableIncome = Math.max(0, annualSalary - salaryDeduction - TAX_CONSTANTS.basicDeduction)
  
  // 所得税率（累進税率による年額計算）
  let annualIncomeTax = 0
  if (taxableIncome <= 1950000) {
    annualIncomeTax = taxableIncome * 0.05
  } else if (taxableIncome <= 3300000) {
    annualIncomeTax = 97500 + (taxableIncome - 1950000) * 0.10
  } else if (taxableIncome <= 6950000) {
    annualIncomeTax = 232500 + (taxableIncome - 3300000) * 0.20
  } else {
    // 695万円超は23%
    annualIncomeTax = 962500 + (taxableIncome - 6950000) * 0.23
  }
  
  // 年額を12で割って月額に変換
  const monthlyIncomeTax = Math.floor(annualIncomeTax / 12)
  
  // 住民税計算（年額ベース）
  // 住民税は前年所得ベースの概算
  const residentTaxBase = Math.max(0, taxableIncome - (TAX_CONSTANTS.residentBasicDeduction - TAX_CONSTANTS.basicDeduction))
  const annualResidentTax = TAX_CONSTANTS.residentEqualTax + (residentTaxBase * 0.10) // 均等割 + 所得割10%
  
  // 年額を12で割って月額に変換
  const monthlyResidentTax = Math.floor(annualResidentTax / 12)
  
  return {
    incomeTax: monthlyIncomeTax,
    residentTax: monthlyResidentTax,
    total: monthlyIncomeTax + monthlyResidentTax,
  }
}

/**
 * 現在の収支を計算
 * @param salary 月額総支給額
 * @param age 年齢区分
 * @returns 現在の収支詳細
 */
function calculateCurrentIncome(
  salary: number,
  age: 'under40' | 'over40'
): CurrentIncome {
  const socialInsurance = calculateSocialInsurance(salary, age)
  const tax = calculateTax(salary)
  const netIncome = salary - socialInsurance.total - tax.total
  
  return {
    grossSalary: salary,
    socialInsurance,
    tax,
    netIncome,
  }
}

/**
 * 育児休業給付金を計算
 * @param salary 月額総支給額
 * @returns 育児休業給付金の詳細
 */
function calculateChildcareBenefit(salary: number): ChildcareBenefit {
  // 賃金日額 = (月額総支給額 × 6) ÷ 180
  const dailyWage = Math.floor((salary * 6) / 180)
  
  // 上限額チェック
  const isUpperLimit = dailyWage > CHILDCARE_BENEFIT_LIMITS.dailyWageLimit
  const actualDailyWage = isUpperLimit
    ? CHILDCARE_BENEFIT_LIMITS.dailyWageLimit
    : dailyWage
  
  const monthlyBenefits: MonthlyBenefit[] = []
  let cumulative = 0
  
  // 12ヶ月分の給付金を計算
  for (let month = 1; month <= 12; month++) {
    let benefit: number
    
    if (month <= 6) {
      // 1-6ヶ月目: 67%
      benefit = Math.floor(actualDailyWage * 30 * BENEFIT_RATES.first6Months)
      // 上限チェック
      if (benefit > CHILDCARE_BENEFIT_LIMITS.monthly67Percent) {
        benefit = CHILDCARE_BENEFIT_LIMITS.monthly67Percent
      }
    } else {
      // 7-12ヶ月目: 50%
      benefit = Math.floor(actualDailyWage * 30 * BENEFIT_RATES.after7Months)
      // 上限チェック
      if (benefit > CHILDCARE_BENEFIT_LIMITS.monthly50Percent) {
        benefit = CHILDCARE_BENEFIT_LIMITS.monthly50Percent
      }
    }
    
    cumulative += benefit
    
    monthlyBenefits.push({
      month,
      benefit,
      cumulative,
    })
  }
  
  return {
    dailyWage: actualDailyWage,
    isUpperLimit,
    monthlyBenefits,
    total: cumulative,
  }
}

/**
 * 出生後休業支援給付金を計算（配偶者も育休取得時）
 * @param salary 月額総支給額
 * @returns 出生後休業支援給付金の詳細
 */
function calculateEnhancedBenefit(salary: number): EnhancedBenefit {
  // 基本賃金日額計算（制度共通）
  const baseDailyWage = Math.floor((salary * 6) / 180)
  
  // 出生後休業支援給付金の賃金日額（独立した上限適用）
  const isEnhancedUpperLimit = baseDailyWage > ENHANCED_BENEFIT_LIMITS.dailyWageLimit
  const enhancedDailyWage = isEnhancedUpperLimit
    ? ENHANCED_BENEFIT_LIMITS.dailyWageLimit
    : baseDailyWage
  
  // 通常育休給付金の賃金日額（比較用）
  const isNormalUpperLimit = baseDailyWage > CHILDCARE_BENEFIT_LIMITS.dailyWageLimit
  const normalDailyWage = isNormalUpperLimit
    ? CHILDCARE_BENEFIT_LIMITS.dailyWageLimit
    : baseDailyWage
  
  // 28日間の実際の給付金額を直接計算
  const enhancementDays = ENHANCED_BENEFIT_LIMITS.enhancementPeriodDays
  
  // 80%給付（28日間）
  const benefit80_28days = Math.floor(enhancedDailyWage * enhancementDays * BENEFIT_RATES.enhanced)
  const monthlyBenefit80Percent = Math.floor(enhancedDailyWage * 30 * BENEFIT_RATES.enhanced)
  const cappedMonthlyBenefit80Percent = Math.min(
    monthlyBenefit80Percent,
    ENHANCED_BENEFIT_LIMITS.monthly80Percent
  )
  
  // 67%給付（28日間、比較用）
  const benefit67_28days = Math.floor(normalDailyWage * enhancementDays * BENEFIT_RATES.first6Months)
  const monthlyBenefit67Percent = Math.floor(normalDailyWage * 30 * BENEFIT_RATES.first6Months)
  const cappedMonthlyBenefit67Percent = Math.min(
    monthlyBenefit67Percent,
    CHILDCARE_BENEFIT_LIMITS.monthly67Percent
  )
  
  // 正確な上乗せ額計算（28日間ベース）
  const actualBenefit80_28days = Math.min(benefit80_28days, Math.floor(cappedMonthlyBenefit80Percent * enhancementDays / 30))
  const actualBenefit67_28days = Math.min(benefit67_28days, Math.floor(cappedMonthlyBenefit67Percent * enhancementDays / 30))
  const totalEnhancement = actualBenefit80_28days - actualBenefit67_28days
  
  return {
    dailyWage: enhancedDailyWage,
    isUpperLimit: isEnhancedUpperLimit,
    enhancementPeriod: enhancementDays,
    monthlyBenefit80Percent: cappedMonthlyBenefit80Percent,
    monthlyBenefit67Percent: cappedMonthlyBenefit67Percent,
    totalEnhancement,
    yearlyEnhancement: totalEnhancement, // 28日間のみなので年間 = 28日間
  }
}

/**
 * メイン計算関数
 * @param input ユーザーの入力値
 * @returns 計算結果全体
 */
export function calculate(input: CalculatorInput): CalculationResult {
  const current = calculateCurrentIncome(input.salary, input.age)
  const childcare = calculateChildcareBenefit(input.salary)
  const enhancedBenefit = calculateEnhancedBenefit(input.salary)
  
  // 維持率を計算(手取りに対する給付金の割合)
  const benefit6Months = childcare.monthlyBenefits[0].benefit // 1ヶ月目の給付金
  const benefit12Months = childcare.monthlyBenefits[11].benefit // 12ヶ月目の給付金
  
  const maintenanceRate6Months = Math.round(
    (benefit6Months / current.netIncome) * 100
  )
  const maintenanceRate12Months = Math.round(
    (benefit12Months / current.netIncome) * 100
  )
  
  // 出生後休業支援給付金の維持率
  const enhancedMaintenanceRate = Math.round(
    (enhancedBenefit.monthlyBenefit80Percent / current.netIncome) * 100
  )
  
  return {
    input,
    current,
    childcare,
    enhancedBenefit,
    maintenanceRate6Months,
    maintenanceRate12Months,
    enhancedMaintenanceRate,
  }
}

/**
 * 入力値のバリデーション
 * @param salary 月額総支給額
 * @returns バリデーションエラー (エラーがない場合はnull)
 */
export function validateInput(salary: number): ValidationError | null {
  if (!salary || salary === 0) {
    return {
      field: 'salary',
      message: '月額総支給額を入力してください',
      type: 'error',
    }
  }
  
  if (salary < VALIDATION_LIMITS.salaryMin) {
    return {
      field: 'salary',
      message: '金額が低すぎます。給付金の受給要件を満たさない可能性があります',
      type: 'warning',
    }
  }
  
  if (salary >= VALIDATION_LIMITS.salaryMax) {
    return {
      field: 'salary',
      message: '金額が高すぎます。入力内容をご確認ください',
      type: 'error',
    }
  }
  
  return null
}

/**
 * 数値が有効かどうかをチェック
 * @param value チェックする値
 * @returns 有効な数値かどうか
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * 計算結果が有効かどうかをチェック
 * @param result 計算結果
 * @returns 有効な結果かどうか
 */
export function isValidCalculationResult(result: CalculationResult): boolean {
  return (
    isValidNumber(result.current.netIncome) &&
    result.current.netIncome > 0 &&
    isValidNumber(result.childcare.total) &&
    result.childcare.monthlyBenefits.length === 12
  )
}