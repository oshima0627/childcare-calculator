'use client'

/**
 * 出生後休業支援給付金コンポーネント
 * 配偶者も14日以上育休取得する場合の給付金情報を表示
 */

import { formatCurrency } from '../utils/formatter'
import type { EnhancedBenefit } from '../types'
import './EnhancedBenefit.css'

interface EnhancedBenefitProps {
  enhancedBenefit: EnhancedBenefit
  maintenanceRate: number
  normalBenefit: number  // 通常の67%給付金額（比較用）
}

export default function EnhancedBenefitComponent({
  enhancedBenefit,
  maintenanceRate,
  normalBenefit,
}: EnhancedBenefitProps) {
  // 最初の一か月の計算（28日間80% + 2日間67%）
  const enhanced28Days = Math.floor(enhancedBenefit.monthlyBenefit80Percent * 28 / 30)
  const normal2Days = Math.floor(enhancedBenefit.monthlyBenefit67Percent * 2 / 30)
  const firstMonthTotal = enhanced28Days + normal2Days

  return (
    <section className="enhanced-benefit">
      <h2>🌟 出生後休業支援給付金（配偶者も育休取得時）</h2>
      
      <div className="enhanced-conditions">
        <h3>💡 適用条件</h3>
        <div className="conditions-list">
          <div className="condition-item">
            <span className="condition-icon">✓</span>
            <span>夫婦双方が14日以上の育児休業を取得</span>
          </div>
          <div className="condition-item">
            <span className="condition-icon">✓</span>
            <span>子の出生後8週間以内の取得開始</span>
          </div>
        </div>
      </div>
      
      <div className="enhanced-benefits">
        <h3>💰 給付金額</h3>
        <div className="benefit-details">
          <div className="benefit-period">
            <div className="period-header">
              <h4>最初の1か月</h4>
              <div className="benefit-rate enhanced">80%+67%</div>
            </div>
            <div className="benefit-amount enhanced">
              {formatCurrency(firstMonthTotal)}/月
            </div>
            <div className="calculation-breakdown">
              <div className="breakdown-title">計算内訳：</div>
              <div className="breakdown-item">
                上乗せ分（28日間×80%）：{formatCurrency(enhanced28Days)}
              </div>
              <div className="breakdown-item">
                通常分（2日間×67%）：{formatCurrency(normal2Days)}
              </div>
              <div className="breakdown-total">
                合計：{formatCurrency(firstMonthTotal)}
              </div>
            </div>
            <div className="maintenance-rate enhanced">
              手取り維持率 {maintenanceRate}%
            </div>
          </div>
          
          <div className="benefit-period">
            <div className="period-header">
              <h4>2か月目以降</h4>
              <div className="benefit-rate normal">67%</div>
            </div>
            <div className="benefit-amount">
              {formatCurrency(enhancedBenefit.monthlyBenefit67Percent)}/月
            </div>
            <div className="benefit-note">
              通常の育児休業給付金と同額
            </div>
          </div>
        </div>
      </div>
      
      <div className="enhancement-summary">
        <h3>📊 通常給付との比較</h3>
        <div className="comparison-grid">
          <div className="comparison-item highlight">
            <div className="comparison-label">最初の1か月の上乗せ額</div>
            <div className="comparison-value">
              +{formatCurrency(firstMonthTotal - enhancedBenefit.monthlyBenefit67Percent)}
            </div>
            <div className="comparison-note">
              通常{formatCurrency(enhancedBenefit.monthlyBenefit67Percent)} → {formatCurrency(firstMonthTotal)}
            </div>
          </div>
          
          <div className="comparison-item">
            <div className="comparison-label">上乗せ率</div>
            <div className="comparison-value">
            +13%
            </div>
          </div>
          
          <div className="comparison-item">
            <div className="comparison-label">適用期間</div>
            <div className="comparison-value">
              {enhancedBenefit.enhancementPeriod}日間
            </div>
          </div>
          
          {enhancedBenefit.isUpperLimit && (
            <div className="comparison-item warning">
              <div className="comparison-label">⚠️ 上限適用</div>
              <div className="comparison-value">
                高所得のため上限額適用
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="enhanced-info">
        <h3>ℹ️ 制度について</h3>
        <div className="info-content">
          <p>
            <strong>出生後休業支援給付金</strong>は、夫婦が共に育児休業を取得することを促進するため、
            2025年4月から開始された新しい制度です。
          </p>
          <p>
            最初の28日間に限り、従来の67%給付に13%が上乗せされ、
            <strong>合計80%の給付</strong>を受けることができます。
          </p>
          <div className="highlight-note">
            <strong>💡 ポイント</strong><br/>
            育休中は社会保険料が免除され、給付金も非課税のため、
            80%の給付率でも実質的に<strong>手取り10割相当</strong>の収入を確保できます。
          </div>
        </div>
      </div>
    </section>
  )
}