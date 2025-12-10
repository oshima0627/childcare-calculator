/**
 * 育休中の収支コンポーネント
 * 育児休業給付金による収支を1-6ヶ月と7-12ヶ月に分けて表示
 */

import { formatCurrency, formatPercent } from '../utils/formatter'
import type { ChildcareIncomeProps } from '../types'
import './ChildcareIncome.css'

export default function ChildcareIncome({ 
  childcare, 
  maintenanceRate6, 
  maintenanceRate12 
}: ChildcareIncomeProps) {
  const benefit1_6 = childcare.monthlyBenefits[0].benefit
  const benefit7_12 = childcare.monthlyBenefits[11].benefit

  return (
    <section className="childcare-income">
      <h2>🍼 育休中の収支</h2>
      <p className="section-description">
        育児休業給付金による収支です。非課税で社会保険料も免除されます
      </p>

      <div className="income-periods">
        {/* 1-6ヶ月期間 */}
        <div className="period-section period-67">
          <div className="period-header">
            <h3>
              <span className="period-icon">📅</span>
              育休1-6ヶ月目
            </h3>
            <div className="period-rate">給付率 67%</div>
          </div>
          
          <div className="income-breakdown">
            <div className="income-item main-benefit">
              <div className="item-label">
                <span className="item-icon">💰</span>
                <span className="label-text">育児休業給付金</span>
              </div>
              <div className="item-amount">{formatCurrency(benefit1_6)}</div>
            </div>
            
            <div className="income-item exemption">
              <div className="item-label">
                <span className="item-icon">🏥</span>
                <span className="label-text">社会保険料</span>
              </div>
              <div className="item-amount exempted">
                0円
                <span className="exemption-note">(免除)</span>
              </div>
            </div>
            
            <div className="income-item exemption">
              <div className="item-label">
                <span className="item-icon">🗳️</span>
                <span className="label-text">税金</span>
              </div>
              <div className="item-amount exempted">
                0円
                <span className="exemption-note">(非課税)</span>
              </div>
            </div>
            
            <div className="income-separator"></div>
            
            <div className="income-item net-income">
              <div className="item-label">
                <span className="item-icon">💵</span>
                <span className="label-text">実質手取り額</span>
              </div>
              <div className="item-amount final">{formatCurrency(benefit1_6)}</div>
            </div>
            
            <div className="comparison-info">
              <div className="comparison-label">通常時との比較</div>
              <div className="comparison-value">{formatPercent(maintenanceRate6)}</div>
            </div>
          </div>
        </div>

        {/* 7-12ヶ月期間 */}
        <div className="period-section period-50">
          <div className="period-header">
            <h3>
              <span className="period-icon">📅</span>
              育休7-12ヶ月目
            </h3>
            <div className="period-rate">給付率 50%</div>
          </div>
          
          <div className="income-breakdown">
            <div className="income-item main-benefit">
              <div className="item-label">
                <span className="item-icon">💰</span>
                <span className="label-text">育児休業給付金</span>
              </div>
              <div className="item-amount">{formatCurrency(benefit7_12)}</div>
            </div>
            
            <div className="income-item exemption">
              <div className="item-label">
                <span className="item-icon">🏥</span>
                <span className="label-text">社会保険料</span>
              </div>
              <div className="item-amount exempted">
                0円
                <span className="exemption-note">(免除)</span>
              </div>
            </div>
            
            <div className="income-item exemption">
              <div className="item-label">
                <span className="item-icon">🗳️</span>
                <span className="label-text">税金</span>
              </div>
              <div className="item-amount exempted">
                0円
                <span className="exemption-note">(非課税)</span>
              </div>
            </div>
            
            <div className="income-separator"></div>
            
            <div className="income-item net-income">
              <div className="item-label">
                <span className="item-icon">💵</span>
                <span className="label-text">実質手取り額</span>
              </div>
              <div className="item-amount final">{formatCurrency(benefit7_12)}</div>
            </div>
            
            <div className="comparison-info">
              <div className="comparison-label">通常時との比較</div>
              <div className="comparison-value">{formatPercent(maintenanceRate12)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 12ヶ月合計 */}
      <div className="total-summary">
        <h3>📋 12ヶ月合計</h3>
        <div className="summary-content">
          <div className="summary-item">
            <div className="summary-label">総給付金額</div>
            <div className="summary-value">{formatCurrency(childcare.total)}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">月平均</div>
            <div className="summary-value">
              {formatCurrency(Math.round(childcare.total / 12))}
            </div>
          </div>
        </div>
      </div>

      {/* 給付金の特徴 */}
      <div className="benefits-features">
        <h3>✨ 育児休業給付金の特徴</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <div className="feature-content">
              <div className="feature-title">非課税</div>
              <div className="feature-description">
                所得税・住民税がかからないため、<br />
                給付金がそのまま手取りになります
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <div className="feature-content">
              <div className="feature-title">社会保険料免除</div>
              <div className="feature-description">
                健康保険料・厚生年金保険料・雇用保険料が<br />
                免除されます（要申請）
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <div className="feature-content">
              <div className="feature-title">2ヶ月ごと支給</div>
              <div className="feature-description">
                2ヶ月分をまとめて指定口座に<br />
                振り込まれます
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <div className="feature-content">
              <div className="feature-title">申請手続き</div>
              <div className="feature-description">
                原則として勤務先が申請<br />
                （本人申請も可能）
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 賃金日額情報 */}
      <div className="wage-info">
        <h3>📊 計算基礎情報</h3>
        <div className="wage-details">
          <div className="wage-item">
            <div className="wage-label">賃金日額</div>
            <div className="wage-value">{formatCurrency(childcare.dailyWage)}</div>
          </div>
          {childcare.isUpperLimit && (
            <div className="wage-item limit-applied">
              <div className="wage-label">上限適用</div>
              <div className="wage-value">適用中</div>
            </div>
          )}
        </div>
        <p className="wage-note">
          賃金日額は「月額総支給額 × 6ヶ月 ÷ 180日」で計算されます
          {childcare.isUpperLimit && '（上限額16,110円が適用されています）'}
        </p>
      </div>
    </section>
  )
}