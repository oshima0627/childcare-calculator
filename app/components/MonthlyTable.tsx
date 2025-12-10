/**
 * 月別給付金詳細テーブルコンポーネント
 * 12ヶ月分の給付金額と累計を表形式で表示
 */

import React from 'react'
import { formatCurrency, formatMonth } from '../utils/formatter'
import type { MonthlyTableProps } from '../types'
import './MonthlyTable.css'

export default function MonthlyTable({ monthlyBenefits }: MonthlyTableProps) {
  return (
    <section className="monthly-table">
      <h2>📊 12ヶ月詳細</h2>
      <p className="section-description">
        育児休業給付金の月別内訳と累計金額です
      </p>

      <div className="table-container">
        <p className="scroll-hint">
          📱 スマートフォンの場合は横にスワイプしてご覧ください
        </p>
        
        <div className="table-wrapper" role="region" aria-label="12ヶ月分の給付金詳細表">
          <table className="benefits-table">
            <thead>
              <tr>
                <th scope="col" className="month-header">月</th>
                <th scope="col" className="benefit-header">給付金額</th>
                <th scope="col" className="cumulative-header">累計</th>
                <th scope="col" className="rate-header">給付率</th>
              </tr>
            </thead>
            <tbody>
              {monthlyBenefits.map((item, index) => (
                <React.Fragment key={item.month}>
                  <tr 
                    className={`
                      table-row
                      ${index <= 5 ? 'period-67' : 'period-50'}
                      ${index === 5 ? 'last-67-percent' : ''}
                      ${index === 6 ? 'first-50-percent' : ''}
                    `}
                  >
                    <td className="month-cell">
                      <span className="month-text">{formatMonth(item.month)}</span>
                    </td>
                    <td className="benefit-cell">
                      <span className="benefit-amount">
                        {formatCurrency(item.benefit)}
                      </span>
                    </td>
                    <td className="cumulative-cell">
                      <span className="cumulative-amount">
                        {formatCurrency(item.cumulative)}
                      </span>
                    </td>
                    <td className="rate-cell">
                      <span className={`rate-badge ${index <= 5 ? 'rate-67' : 'rate-50'}`}>
                        {index <= 5 ? '67%' : '50%'}
                      </span>
                    </td>
                  </tr>
                  
                  {/* 6ヶ月目と7ヶ月目の間に区切り行を挿入 */}
                  {index === 5 && (
                    <tr className="separator-row">
                      <td colSpan={4} className="separator-cell">
                        <div className="rate-change-notice">
                          <span className="notice-icon">📋</span>
                          <span className="notice-text">
                            給付率が67%から50%に変わります
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td className="total-label">
                  <strong>合計(12ヶ月)</strong>
                </td>
                <td className="total-monthly">
                  <span className="total-note">-</span>
                </td>
                <td className="total-cumulative">
                  <strong className="total-amount">
                    {formatCurrency(monthlyBenefits[11].cumulative)}
                  </strong>
                </td>
                <td className="total-rate">
                  <span className="average-badge">
                    平均
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 支給スケジュール */}
      <div className="payment-schedule">
        <h3>💰 支給スケジュール</h3>
        <div className="schedule-info">
          <div className="schedule-item">
            <div className="schedule-period">1-2ヶ月分</div>
            <div className="schedule-payment">育休開始から2-4ヶ月後</div>
            <div className="schedule-amount">
              {formatCurrency(monthlyBenefits[0].benefit + monthlyBenefits[1].benefit)}
            </div>
          </div>
          
          <div className="schedule-item">
            <div className="schedule-period">3-4ヶ月分</div>
            <div className="schedule-payment">初回から約2ヶ月後</div>
            <div className="schedule-amount">
              {formatCurrency(monthlyBenefits[2].benefit + monthlyBenefits[3].benefit)}
            </div>
          </div>
          
          <div className="schedule-item">
            <div className="schedule-period">5-6ヶ月分</div>
            <div className="schedule-payment">2回目から約2ヶ月後</div>
            <div className="schedule-amount">
              {formatCurrency(monthlyBenefits[4].benefit + monthlyBenefits[5].benefit)}
            </div>
          </div>
          
          <div className="schedule-item highlight">
            <div className="schedule-period">7-8ヶ月分</div>
            <div className="schedule-payment">給付率50%に変更</div>
            <div className="schedule-amount">
              {formatCurrency(monthlyBenefits[6].benefit + monthlyBenefits[7].benefit)}
            </div>
          </div>
          
          <div className="schedule-item">
            <div className="schedule-period">9-10ヶ月分</div>
            <div className="schedule-payment">50%給付率継続</div>
            <div className="schedule-amount">
              {formatCurrency(monthlyBenefits[8].benefit + monthlyBenefits[9].benefit)}
            </div>
          </div>
          
          <div className="schedule-item">
            <div className="schedule-period">11-12ヶ月分</div>
            <div className="schedule-payment">最終回</div>
            <div className="schedule-amount">
              {formatCurrency(monthlyBenefits[10].benefit + monthlyBenefits[11].benefit)}
            </div>
          </div>
        </div>
        
        <div className="schedule-note">
          <p>
            <strong>📅 注意:</strong> 支給は2ヶ月分をまとめて行われます。
            初回支給までは育休開始から2-4ヶ月かかる場合があります。
          </p>
        </div>
      </div>

      {/* 月別の特徴 */}
      <div className="monthly-features">
        <h3>📈 期間別の特徴</h3>
        <div className="features-comparison">
          <div className="feature-period period-67">
            <div className="feature-header">
              <h4>1-6ヶ月目（給付率67%）</h4>
              <div className="period-badge rate-67">高給付率期間</div>
            </div>
            <div className="feature-content">
              <ul>
                <li>月額: {formatCurrency(monthlyBenefits[0].benefit)}</li>
                <li>6ヶ月合計: {formatCurrency(monthlyBenefits[5].cumulative)}</li>
                <li>育児に専念できる手厚い支援</li>
                <li>社会復帰に向けた準備期間</li>
              </ul>
            </div>
          </div>

          <div className="feature-period period-50">
            <div className="feature-header">
              <h4>7-12ヶ月目（給付率50%）</h4>
              <div className="period-badge rate-50">継続支援期間</div>
            </div>
            <div className="feature-content">
              <ul>
                <li>月額: {formatCurrency(monthlyBenefits[6].benefit)}</li>
                <li>6ヶ月合計: {formatCurrency(monthlyBenefits[11].cumulative - monthlyBenefits[5].cumulative)}</li>
                <li>職場復帰への段階的準備</li>
                <li>保育園入園に向けた調整期間</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}