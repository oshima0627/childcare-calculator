import { describe, it, expect } from 'vitest'
import {
  calculate,
  validateInput,
  isValidNumber,
  isValidCalculationResult,
} from './calculator'
import {
  CHILDCARE_BENEFIT_LIMITS,
  ENHANCED_BENEFIT_LIMITS,
  BENEFIT_RATES,
  VALIDATION_LIMITS,
} from './constants'

function result(salary: number) {
  return calculate({ salary })
}

describe('賃金日額', () => {
  // 賃金日額 = 休業開始前6ヶ月の賃金 ÷ 180 = 月額 × 6 ÷ 180。
  it('月額総支給額の30分の1になる', () => {
    expect(result(300_000).childcare.dailyWage).toBe(10_000)
    expect(result(240_000).childcare.dailyWage).toBe(8_000)
  })

  it('円未満は切り捨てる', () => {
    // 250,000 × 6 / 180 = 8333.33...
    expect(result(250_000).childcare.dailyWage).toBe(8_333)
  })

  it('上限（16,110円）を超えると上限額で頭打ちになる', () => {
    const high = result(1_000_000)

    expect(high.childcare.isUpperLimit).toBe(true)
    expect(high.childcare.dailyWage).toBe(CHILDCARE_BENEFIT_LIMITS.dailyWageLimit)
  })

  it('上限以下なら上限フラグは立たない', () => {
    const low = result(300_000)

    expect(low.childcare.isUpperLimit).toBe(false)
  })
})

describe('育児休業給付金の月額', () => {
  it('12ヶ月分が並ぶ', () => {
    expect(result(300_000).childcare.monthlyBenefits).toHaveLength(12)
    expect(result(300_000).childcare.monthlyBenefits.map((m) => m.month)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
  })

  it('1〜6ヶ月目は賃金日額×30の67%', () => {
    const { monthlyBenefits } = result(300_000).childcare
    const expected = Math.floor(10_000 * 30 * BENEFIT_RATES.first6Months)

    for (const month of monthlyBenefits.slice(0, 6)) {
      expect(month.benefit).toBe(expected)
    }
  })

  it('7〜12ヶ月目は賃金日額×30の50%', () => {
    const { monthlyBenefits } = result(300_000).childcare
    const expected = Math.floor(10_000 * 30 * BENEFIT_RATES.after7Months)

    for (const month of monthlyBenefits.slice(6)) {
      expect(month.benefit).toBe(expected)
    }
  })

  it('6ヶ月目と7ヶ月目で給付率が切り替わる', () => {
    const { monthlyBenefits } = result(300_000).childcare

    expect(monthlyBenefits[5].benefit).toBeGreaterThan(monthlyBenefits[6].benefit)
  })

  it('高収入でも月額上限を超えない', () => {
    const { monthlyBenefits } = result(1_500_000).childcare

    for (const month of monthlyBenefits.slice(0, 6)) {
      expect(month.benefit).toBeLessThanOrEqual(CHILDCARE_BENEFIT_LIMITS.monthly67Percent)
    }
    for (const month of monthlyBenefits.slice(6)) {
      expect(month.benefit).toBeLessThanOrEqual(CHILDCARE_BENEFIT_LIMITS.monthly50Percent)
    }
  })

  it('累計は各月の給付金の積み上げになっている', () => {
    const { monthlyBenefits, total } = result(300_000).childcare

    let running = 0
    for (const month of monthlyBenefits) {
      running += month.benefit
      expect(month.cumulative).toBe(running)
    }
    expect(total).toBe(running)
  })

  it('給与が上がれば年間総額も下がらない（単調非減少）', () => {
    let previous = 0
    for (let salary = 100_000; salary <= 1_500_000; salary += 13_577) {
      const { total } = result(salary).childcare
      expect(total).toBeGreaterThanOrEqual(previous)
      previous = total
    }
  })

  it('上限に達した後は給与が増えても総額が増えない', () => {
    const atCap = result(1_000_000).childcare.total
    const wayAboveCap = result(1_900_000).childcare.total

    expect(wayAboveCap).toBe(atCap)
  })
})

describe('出生後休業支援給付金（28日間の上乗せ）', () => {
  it('適用期間は28日', () => {
    expect(result(300_000).enhancedBenefit.enhancementPeriod).toBe(
      ENHANCED_BENEFIT_LIMITS.enhancementPeriodDays,
    )
  })

  it('通常の育休給付金とは別の賃金日額上限（15,690円）を使う', () => {
    const high = result(1_000_000)

    expect(high.enhancedBenefit.isUpperLimit).toBe(true)
    expect(high.enhancedBenefit.dailyWage).toBe(ENHANCED_BENEFIT_LIMITS.dailyWageLimit)
    // 通常給付の上限（16,110円）とは異なる値であること。
    expect(high.enhancedBenefit.dailyWage).not.toBe(CHILDCARE_BENEFIT_LIMITS.dailyWageLimit)
  })

  it('80%給付の月額は67%給付の月額より大きい', () => {
    const { enhancedBenefit } = result(300_000)

    expect(enhancedBenefit.monthlyBenefit80Percent).toBeGreaterThan(
      enhancedBenefit.monthlyBenefit67Percent,
    )
  })

  it('上乗せ額は 80%給付と67%給付の差額（28日分）', () => {
    const { enhancedBenefit } = result(300_000)

    expect(enhancedBenefit.totalEnhancement).toBeGreaterThan(0)
    // 28日間のみの制度なので、年間の上乗せ総額と一致する。
    expect(enhancedBenefit.yearlyEnhancement).toBe(enhancedBenefit.totalEnhancement)
  })

  it('月額上限を超えない', () => {
    const { enhancedBenefit } = result(1_500_000)

    expect(enhancedBenefit.monthlyBenefit80Percent).toBeLessThanOrEqual(
      ENHANCED_BENEFIT_LIMITS.monthly80Percent,
    )
  })

  it('どの給与額でも上乗せ額がマイナスにならない', () => {
    for (let salary = 100_000; salary <= 1_900_000; salary += 17_351) {
      expect(result(salary).enhancedBenefit.totalEnhancement).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('現在の手取りと維持率', () => {
  it('手取りは額面より小さい', () => {
    const { current } = result(300_000)

    expect(current.grossSalary).toBe(300_000)
    expect(current.netIncome).toBeGreaterThan(0)
    expect(current.netIncome).toBeLessThan(300_000)
  })

  it('手取り = 額面 - 社会保険料 - 税金', () => {
    const { current } = result(300_000)

    expect(current.netIncome).toBe(
      current.grossSalary - current.socialInsurance.total - current.tax.total,
    )
  })

  it('社会保険料の合計は内訳の合計と一致する', () => {
    const { socialInsurance } = result(300_000).current

    expect(socialInsurance.total).toBe(
      socialInsurance.healthInsurance +
        socialInsurance.pensionInsurance +
        socialInsurance.employmentInsurance,
    )
  })

  it('1〜6ヶ月の維持率は7〜12ヶ月より高い', () => {
    const r = result(300_000)

    expect(r.maintenanceRate6Months).toBeGreaterThan(r.maintenanceRate12Months)
  })

  it('給付金は非課税のため、額面比67%でも手取り比では8割前後を維持する', () => {
    const r = result(300_000)

    expect(r.maintenanceRate6Months).toBeGreaterThan(67)
    expect(r.maintenanceRate6Months).toBeLessThan(100)
  })

  it('80%給付時の維持率が最も高い', () => {
    const r = result(300_000)

    expect(r.enhancedMaintenanceRate).toBeGreaterThan(r.maintenanceRate6Months)
  })
})

describe('validateInput', () => {
  it('通常の給与額ならエラーなし', () => {
    expect(validateInput(300_000)).toBeNull()
  })

  it('未入力・0はエラー', () => {
    expect(validateInput(0)?.type).toBe('error')
  })

  it('下限未満は警告（エラーではない）', () => {
    const error = validateInput(VALIDATION_LIMITS.salaryMin - 1)

    expect(error?.type).toBe('warning')
    expect(error?.field).toBe('salary')
  })

  it('下限ちょうどは警告にならない', () => {
    expect(validateInput(VALIDATION_LIMITS.salaryMin)).toBeNull()
  })

  it('上限以上はエラー（上限ちょうどを含む）', () => {
    expect(validateInput(VALIDATION_LIMITS.salaryMax)?.type).toBe('error')
    expect(validateInput(VALIDATION_LIMITS.salaryMax + 1)?.type).toBe('error')
  })
})

describe('isValidNumber', () => {
  it('有限の数値だけを通す', () => {
    expect(isValidNumber(0)).toBe(true)
    expect(isValidNumber(-1.5)).toBe(true)
  })

  it('NaN・Infinity・数値以外は弾く', () => {
    expect(isValidNumber(NaN)).toBe(false)
    expect(isValidNumber(Infinity)).toBe(false)
    expect(isValidNumber('300000')).toBe(false)
    expect(isValidNumber(null)).toBe(false)
    expect(isValidNumber(undefined)).toBe(false)
  })
})

describe('isValidCalculationResult', () => {
  it('通常の計算結果は有効', () => {
    expect(isValidCalculationResult(result(300_000))).toBe(true)
  })

  it('手取りが0以下の結果は無効', () => {
    const broken = result(300_000)
    broken.current.netIncome = 0

    expect(isValidCalculationResult(broken)).toBe(false)
  })

  it('月別給付金が12ヶ月分ない結果は無効', () => {
    const broken = result(300_000)
    broken.childcare.monthlyBenefits = broken.childcare.monthlyBenefits.slice(0, 6)

    expect(isValidCalculationResult(broken)).toBe(false)
  })
})
