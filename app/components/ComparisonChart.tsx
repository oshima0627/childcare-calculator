/**
 * 横棒グラフ比較コンポーネント
 * 通常時の手取りと育休時の給付金を視覚的に比較表示
 */

import { formatCurrency, formatPercent } from '../utils/formatter'
import type { ComparisonChartProps } from '../types'
import './ComparisonChart.css'

export default function ComparisonChart({ result }: ComparisonChartProps) {
  const { current, childcare, maintenanceRate6Months, maintenanceRate12Months } = result

  // 基準値（通常時の手取り）を100%とする
  const baseIncome = current.netIncome
  const benefit6Months = childcare.monthlyBenefits[0].benefit
  const benefit12Months = childcare.monthlyBenefits[11].benefit

  // グラフデータの準備
  const chartData = [
    {
      label: '通常時の手取り',
      amount: baseIncome,
      percentage: 100,
      className: 'chart-bar-full',
      description: '社会保険料・税金を差し引いた手取り額',
    },
    {
      label: '育休1-6ヶ月',
      amount: benefit6Months,
      percentage: maintenanceRate6Months,
      className: 'chart-bar-67',
      description: '給付率67%（非課税、社会保険料免除）',
    },
    {
      label: '育休7-12ヶ月',
      amount: benefit12Months,
      percentage: maintenanceRate12Months,
      className: 'chart-bar-50',
      description: '給付率50%（非課税、社会保険料免除）',
    },
  ]

  return (
    <section className="comparison-chart">
      <h2>💰 手取り額の比較</h2>
      <p className="chart-description">
        通常時の手取りを100%として、育児休業給付金との比較を表示しています
      </p>

      <div className="chart-container">
        {chartData.map((item, index) => (
          <div key={index} className="chart-row">
            <div className="chart-label-section">
              <div className="chart-label">{item.label}</div>
              <div className="chart-description-text">{item.description}</div>
            </div>

            <div className="chart-bar-wrapper">
              <div 
                className={`chart-bar ${item.className}`}
                style={{ 
                  width: `${Math.max(item.percentage, 8)}%`, // 最小幅8%で視認性確保
                }}
                role="img"
                aria-label={`${item.label}: ${formatCurrency(item.amount)} (${formatPercent(item.percentage)})`}
              >
                <div className="chart-bar-content">
                  <span className="chart-amount">{formatCurrency(item.amount)}</span>
                  {index > 0 && (
                    <span className="chart-percentage">{formatPercent(item.percentage)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="chart-details">
              <div className="detail-amount">{formatCurrency(item.amount)}</div>
              {index > 0 && (
                <div className="detail-percentage">{formatPercent(item.percentage)}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chart-legend">
        <h3>📊 グラフの見方</h3>
        <ul>
          <li>
            <span className="legend-color legend-full"></span>
            <strong>通常時</strong>: 給与から社会保険料・税金を差し引いた実際の手取り額
          </li>
          <li>
            <span className="legend-color legend-67"></span>
            <strong>育休前半</strong>: 給付率67%、非課税・社会保険料免除
          </li>
          <li>
            <span className="legend-color legend-50"></span>
            <strong>育休後半</strong>: 給付率50%、非課税・社会保険料免除
          </li>
        </ul>
      </div>

      <div className="chart-notes">
        <h3>💡 ポイント</h3>
        <div className="notes-grid">
          <div className="note-item">
            <div className="note-icon">🔸</div>
            <div className="note-content">
              <strong>非課税</strong><br />
              育児休業給付金には所得税・住民税がかかりません
            </div>
          </div>
          <div className="note-item">
            <div className="note-icon">🔸</div>
            <div className="note-content">
              <strong>社会保険料免除</strong><br />
              育休中の社会保険料は免除されます（要申請）
            </div>
          </div>
          <div className="note-item">
            <div className="note-icon">🔸</div>
            <div className="note-content">
              <strong>2ヶ月ごと支給</strong><br />
              給付金は2ヶ月分ずつまとめて支給されます
            </div>
          </div>
        </div>
      </div>

      {/* 上限額に達している場合の追加説明 */}
      {childcare.isUpperLimit && (
        <div className="upper-limit-info">
          <h3>⚠️ 上限額について</h3>
          <p>
            あなたの給与は給付金の上限額を超えているため、実際の給付額は上限額が適用されます。
            上限額は毎年8月1日に見直されます。
          </p>
        </div>
      )}
    </section>
  )
}