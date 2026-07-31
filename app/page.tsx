'use client'

/**
 * メインページ
 * InputFormを表示し、将来的に計算結果を表示する
 */

import { useState } from 'react'
import InputForm from './components/InputForm'
import ComparisonChart from './components/ComparisonChart'
import CurrentIncome from './components/CurrentIncome'
import ChildcareIncome from './components/ChildcareIncome'
import EnhancedBenefit from './components/EnhancedBenefit'
import MonthlyTable from './components/MonthlyTable'
import SocialShare from './components/SocialShare'
import FAQ from './components/FAQ'
import AffiliateCard from './components/AffiliateCard'
import { calculate } from './utils/calculator'
import { formatCurrency, formatPercent } from './utils/formatter'
import type { CalculatorInput, CalculationResult } from './types'

export default function HomePage() {
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  /**
   * 計算実行処理
   */
  const handleCalculate = (input: CalculatorInput) => {
    try {
      const calculationResult = calculate(input)
      setResult(calculationResult)
      setHasCalculated(true)
    } catch (error) {
      console.error('計算エラー:', error)
      setResult(null)
      setHasCalculated(false)
    }
  }

  return (
    <div className="main-content">
      <div className="intro-section">
        <h2>育児休業給付金を簡単計算</h2>
        <p className="intro-text">
          月額給与を入力するだけで、育児休業給付金の手取り額を自動計算。
          現在の手取りとの比較もできます。
        </p>
        <div className="features">
          <div className="feature-item">
            <span className="feature-icon">💰</span>
            <span>正確な計算</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>視覚的比較</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span>スマホ対応</span>
          </div>
        </div>
      </div>

      <InputForm onCalculate={handleCalculate} />

      {hasCalculated && result && (
        <div className="detailed-results">
          <ComparisonChart result={result} />
          <CurrentIncome current={result.current} />
          <ChildcareIncome 
            childcare={result.childcare}
            maintenanceRate6={result.maintenanceRate6Months}
            maintenanceRate12={result.maintenanceRate12Months}
          />
          <EnhancedBenefit
            enhancedBenefit={result.enhancedBenefit}
            maintenanceRate={result.enhancedMaintenanceRate}
            normalBenefit={result.childcare.monthlyBenefits[0].benefit}
          />
          <MonthlyTable monthlyBenefits={result.childcare.monthlyBenefits} />
          <AffiliateCard />
          <SocialShare result={result} />
        </div>
      )}

      {!hasCalculated && (
        <section className="getting-started">
          <h2>使い方</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>月額総支給額を入力</h3>
                <p>賞与を除いた月額の総支給額を入力してください</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>結果を確認</h3>
                <p>自動で計算結果が表示されます</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <FAQ />

      <AffiliateCard />

      <style jsx>{`
        .main-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .intro-section {
          text-align: center;
          margin-bottom: var(--spacing-xl);
          padding: var(--spacing-xl) var(--spacing-lg);
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          border-radius: var(--border-radius-lg);
        }

        .intro-text {
          font-size: var(--font-size-lg);
          color: #555;
          margin: var(--spacing-md) 0 var(--spacing-xl);
          line-height: var(--line-height-relaxed);
        }

        .features {
          display: flex;
          justify-content: center;
          gap: var(--spacing-lg);
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-weight: 600;
          color: var(--color-primary);
        }

        .feature-icon {
          font-size: var(--font-size-lg);
        }

        .detailed-results {
          margin-top: var(--spacing-xl);
        }

        .getting-started {
          margin-top: var(--spacing-xl);
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-md);
          background: var(--color-white);
          padding: var(--spacing-lg);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
        }

        .step-number {
          background: var(--color-primary);
          color: var(--color-white);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: var(--font-size-lg);
          flex-shrink: 0;
        }

        .step-content h3 {
          margin-bottom: var(--spacing-xs);
          color: var(--color-primary);
        }

        .step-content p {
          color: #666;
          margin: 0;
        }

        @media (max-width: 768px) {
          .features {
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-sm);
          }

          .intro-section {
            padding: var(--spacing-lg) var(--spacing-md);
          }
        }
      `}</style>
    </div>
  )
}