/**
 * 現在の収支コンポーネント
 * 給与から社会保険料・税金を差し引いた収支内訳を表示
 */

import { formatCurrency } from '../utils/formatter'
import type { CurrentIncomeProps } from '../types'
import './CurrentIncome.css'

export default function CurrentIncome({ current }: CurrentIncomeProps) {
  const { grossSalary, socialInsurance, tax, netIncome } = current

  return (
    <section className="current-income">
      <h2>📊 現在の収支</h2>
      <p className="section-description">
        あなたの給与から各種控除を差し引いた手取り額の内訳です
      </p>

      <div className="income-breakdown">
        <div className="income-item gross-salary">
          <div className="item-label">
            <span className="item-icon">💰</span>
            <span className="label-text">月額総支給額</span>
          </div>
          <div className="item-amount positive">{formatCurrency(grossSalary)}</div>
        </div>

        <div className="deductions-section">
          <h3 className="deductions-title">控除項目</h3>
          
          {/* 社会保険料 */}
          <div className="deduction-group">
            <div className="income-item deduction-total">
              <div className="item-label">
                <span className="item-icon">🏥</span>
                <span className="label-text">社会保険料合計</span>
              </div>
              <div className="item-amount negative">-{formatCurrency(socialInsurance.total)}</div>
            </div>
            
            <div className="deduction-details">
              <div className="detail-item">
                <div className="detail-label">└ 健康保険料</div>
                <div className="detail-amount">-{formatCurrency(socialInsurance.healthInsurance)}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">
                  └ 介護保険料
                  {socialInsurance.careInsurance === 0 && (
                    <span className="age-note">(40歳未満のため0円)</span>
                  )}
                </div>
                <div className="detail-amount">-{formatCurrency(socialInsurance.careInsurance)}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">└ 厚生年金保険料</div>
                <div className="detail-amount">-{formatCurrency(socialInsurance.pensionInsurance)}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">└ 雇用保険料</div>
                <div className="detail-amount">-{formatCurrency(socialInsurance.employmentInsurance)}</div>
              </div>
            </div>
          </div>

          {/* 税金 */}
          <div className="deduction-group">
            <div className="income-item deduction-total">
              <div className="item-label">
                <span className="item-icon">🗳️</span>
                <span className="label-text">税金合計（概算）</span>
              </div>
              <div className="item-amount negative">-{formatCurrency(tax.total)}</div>
            </div>
            
            <div className="deduction-details">
              <div className="detail-item">
                <div className="detail-label">└ 所得税</div>
                <div className="detail-amount">-{formatCurrency(tax.incomeTax)}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">└ 住民税</div>
                <div className="detail-amount">-{formatCurrency(tax.residentTax)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="income-separator"></div>

        <div className="income-item net-income">
          <div className="item-label">
            <span className="item-icon">💵</span>
            <span className="label-text">手取り額</span>
          </div>
          <div className="item-amount final">{formatCurrency(netIncome)}</div>
        </div>
      </div>

      <div className="calculation-notes">
        <h3>📝 計算についての注意</h3>
        <div className="notes-list">
          <div className="note-item">
            <span className="note-bullet">•</span>
            <span className="note-text">
              社会保険料は<strong>標準報酬月額</strong>を基に計算されています
            </span>
          </div>
          <div className="note-item">
            <span className="note-bullet">•</span>
            <span className="note-text">
              健康保険料率は<strong>全国平均10%</strong>を使用（実際は都道府県により9.44%〜10.78%）
            </span>
          </div>
          <div className="note-item">
            <span className="note-bullet">•</span>
            <span className="note-text">
              税金は<strong>概算</strong>です（実際は年収・控除により変動）
            </span>
          </div>
          <div className="note-item">
            <span className="note-bullet">•</span>
            <span className="note-text">
              賞与（ボーナス）は<strong>含まれていません</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="deduction-rates">
        <h3>📈 控除率</h3>
        <div className="rates-grid">
          <div className="rate-item">
            <div className="rate-label">社会保険料</div>
            <div className="rate-value">
              {Math.round((socialInsurance.total / grossSalary) * 100)}%
            </div>
          </div>
          <div className="rate-item">
            <div className="rate-label">税金</div>
            <div className="rate-value">
              {Math.round((tax.total / grossSalary) * 100)}%
            </div>
          </div>
          <div className="rate-item">
            <div className="rate-label">手取り率</div>
            <div className="rate-value highlight">
              {Math.round((netIncome / grossSalary) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}