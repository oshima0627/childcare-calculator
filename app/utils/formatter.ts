/**
 * 数値フォーマット関数
 * 日本の表示形式に対応
 */

/**
 * 数値を3桁カンマ区切りにフォーマット
 * @param value フォーマットする数値
 * @returns カンマ区切りされた文字列
 */
export function formatNumber(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0'
  }
  return value.toLocaleString('ja-JP')
}

/**
 * 円表示にフォーマット
 * @param value フォーマットする数値
 * @returns 「○○円」形式の文字列
 */
export function formatCurrency(value: number): string {
  return `${formatNumber(value)}円`
}

/**
 * パーセント表示にフォーマット
 * @param value パーセント値(0-100)
 * @returns 「約○○%」形式の文字列
 */
export function formatPercent(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '約0%'
  }
  return `約${Math.round(value)}%`
}

/**
 * カンマ区切り文字列を数値に変換
 * @param value カンマ区切りの文字列
 * @returns 数値 (変換できない場合は0)
 */
export function parseFormattedNumber(value: string): number {
  if (typeof value !== 'string') {
    return 0
  }
  const cleanValue = value.replace(/[,\s]/g, '')
  const parsed = parseInt(cleanValue, 10)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * 文字列から数値を安全に抽出
 * @param value 文字列
 * @returns 数値 (変換できない場合は0)
 */
export function safeParseInt(value: string | number): number {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : Math.floor(value)
  }
  if (typeof value === 'string') {
    const parsed = parseInt(value.replace(/[^\d]/g, ''), 10)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

/**
 * 入力値を数値にフォーマット(入力フィールド用)
 * @param value 入力値
 * @param allowEmpty 空文字を許可するか
 * @returns フォーマットされた文字列
 */
export function formatInputNumber(value: string, allowEmpty = false): string {
  // 空文字の場合
  if (value === '' || value.trim() === '') {
    return allowEmpty ? '' : ''
  }
  
  const numericValue = parseFormattedNumber(value)
  
  // 有効な数値が入力されている場合は、0でもフォーマットして返す
  if (!isNaN(numericValue) && value.trim() !== '') {
    return formatNumber(numericValue)
  }
  
  // 無効な入力の場合は空文字を返す
  return ''
}

/**
 * 金額の範囲をフォーマット
 * @param min 最小値
 * @param max 最大値
 * @returns 「○○円～○○円」形式の文字列
 */
export function formatCurrencyRange(min: number, max: number): string {
  return `${formatCurrency(min)}～${formatCurrency(max)}`
}

/**
 * 月表示をフォーマット
 * @param month 月数(1-12)
 * @returns 「○ヶ月目」形式の文字列
 */
export function formatMonth(month: number): string {
  return `${month}ヶ月目`
}

/**
 * 期間表示をフォーマット
 * @param startMonth 開始月
 * @param endMonth 終了月
 * @returns 「○-○ヶ月」形式の文字列
 */
export function formatPeriod(startMonth: number, endMonth: number): string {
  return `${startMonth}-${endMonth}ヶ月`
}

/**
 * 数値を安全にフォーマット（エラー処理付き）
 * @param value フォーマットする値
 * @param formatter フォーマット関数
 * @param fallback フォールバック値
 * @returns フォーマットされた文字列
 */
export function safeFormat<T>(
  value: T,
  formatter: (value: T) => string,
  fallback = '---'
): string {
  try {
    return formatter(value)
  } catch (error) {
    console.warn('Format error:', error)
    return fallback
  }
}

/**
 * 大きな数値を略して表示（10万円以上の場合）
 * @param value 数値
 * @returns 略された文字列（例: 30万円、150万円）
 */
export function formatLargeNumber(value: number): string {
  if (value >= 10000) {
    const manValue = Math.round(value / 10000)
    return `${manValue}万円`
  }
  return formatCurrency(value)
}

/**
 * バリデーションエラーメッセージのフォーマット
 * @param field フィールド名
 * @param type エラータイプ
 * @returns フォーマットされたエラーメッセージ
 */
export function formatValidationMessage(field: string, type: 'error' | 'warning'): string {
  const prefix = type === 'error' ? 'エラー' : '警告'
  return `${prefix}: ${field}に問題があります`
}

/**
 * 日付をフォーマット（日本形式）
 * @param date 日付オブジェクト
 * @returns YYYY年MM月DD日形式の文字列
 */
export function formatJapaneseDate(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

/**
 * 更新日時のフォーマット
 * @param date 日付オブジェクト
 * @returns 「令和○年○月○日時点」形式の文字列
 */
export function formatUpdateDate(date: Date): string {
  const year = date.getFullYear()
  const reiwaYear = year - 2018 // 令和元年は2019年
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `令和${reiwaYear}年${month}月${day}日時点`
}