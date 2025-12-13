'use client'

/**
 * 入力フォームコンポーネント
 * ユーザーの月額総支給額を入力
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { validateInput } from '../utils/calculator'
import { formatInputNumber, parseFormattedNumber, formatNumber } from '../utils/formatter'
import { DEBOUNCE_TIME } from '../utils/constants'
import type { InputFormProps, ValidationError } from '../types'
import './InputForm.css'

export default function InputForm({
  onCalculate,
  initialSalary = 0,
}: InputFormProps) {
  const [salary, setSalary] = useState<string>(
    initialSalary > 0 ? formatInputNumber(String(initialSalary)) : ''
  )
  const [error, setError] = useState<ValidationError | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * 計算実行のデバウンス処理
   */
  const executeCalculation = useCallback(() => {
    const numericSalary = parseFormattedNumber(salary)
    const validation = validateInput(numericSalary)
    
    setError(validation)
    
    // エラータイプでない場合は計算を実行
    if (!validation || validation.type !== 'error') {
      onCalculate({
        salary: numericSalary,
      })
    }
  }, [salary, onCalculate])

  /**
   * デバウンス付きの計算実行
   */
  const debouncedCalculate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      executeCalculation()
    }, DEBOUNCE_TIME)
  }, [executeCalculation])

  /**
   * 給与入力の変更処理
   */
  const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSalary(value)
  }

  /**
   * 給与入力のブラー処理（フォーカスアウト時の処理）
   */
  const handleSalaryBlur = () => {
    // 空文字や空白のみの場合は何もしない
    if (!salary || !salary.trim()) {
      return
    }
    
    // 数値として解析
    const numericValue = parseFormattedNumber(salary.trim())
    
    // 計算は正の数の場合のみ
    if (numericValue > 0) {
      debouncedCalculate()
    }
  }



  /**
   * 初期値が設定されている場合の自動計算
   */
  useEffect(() => {
    if (initialSalary > 0) {
      executeCalculation()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * コンポーネントのクリーンアップ
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <section className="input-form">
      <h2>給与情報入力</h2>
      
      <div className="form-group">
        <label htmlFor="salary">
          月額総支給額（円）
          <span className="required">*</span>
        </label>
        <input
          type="number"
          id="salary"
          value={salary}
          onChange={handleSalaryChange}
          onBlur={handleSalaryBlur}
          min="0"
          max="2000000"
          step="1000"
          placeholder="例: 300000"
          aria-label="月額総支給額"
          aria-describedby={error ? 'salary-error' : undefined}
          className={error?.field === 'salary' ? 'has-error' : ''}
        />
        {error && error.field === 'salary' && (
          <p 
            id="salary-error"
            className={`error-message ${error.type}`}
            role="alert"
          >
            {error.message}
          </p>
        )}
        <p className="form-help">
          賞与（ボーナス）は含めず、月額の総支給額を入力してください
        </p>
      </div>
      
      <div className="form-status">
        {salary && parseFormattedNumber(salary) > 0 ? (
          <p className="status-message success">
            ✓ 入力完了 - 計算結果が下に表示されます
          </p>
        ) : (
          <p className="status-message info">
            月額総支給額を入力すると自動で計算されます
          </p>
        )}
      </div>
    </section>
  )
}