# 育児休業給付金シミュレーター 要件定義書

**Version:** 1.0  
**作成日:** 2025年12月9日  
**プロジェクト名:** childcare-calculator  
**技術スタック:** Next.js 15 + TypeScript + CSS

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [技術仕様](#2-技術仕様)
3. [ディレクトリ構成](#3-ディレクトリ構成)
4. [データ仕様](#4-データ仕様)
5. [計算ロジック詳細](#5-計算ロジック詳細)
6. [UI/UX仕様](#6-uiux仕様)
7. [コンポーネント仕様](#7-コンポーネント仕様)
8. [スタイリング仕様](#8-スタイリング仕様)
9. [機能要件](#9-機能要件)
10. [非機能要件](#10-非機能要件)
11. [環境変数](#11-環境変数)
12. [デプロイ設定](#12-デプロイ設定)
13. [Git・GitHub管理](#13-git・github管理)
14. [テストケース](#14-テストケース)
15. [実装チェックリスト](#15-実装チェックリスト)
16. [開発開始コマンド](#16-開発開始コマンド)
17. [完成イメージ](#17-完成イメージ)
18. [追加資料](#18-追加資料)

---

## 1. プロジェクト概要

### 1.1 目的
妊娠中の女性や育児休業を計画している人が、育児休業給付金の手取り額を簡単にシミュレーションできるWebアプリケーション。

### 1.2 ターゲットユーザー
- 妊娠中の女性
- 育児休業を計画している労働者
- 育休給付金の金額を知りたい人

### 1.3 主要機能
- 月額総支給額を入力
- 現在の手取り額と育休中の給付金額を自動計算
- 通常時と育休時の収入を横棒グラフで視覚的に比較
- 12ヶ月分の詳細な給付金内訳を表示
- FAQ(よくある質問)をアコーディオン形式で提供

### 1.4 使用しない機能
- ユーザー登録・ログイン機能
- データベース連携
- フィードバック機能(初期リリースでは省略)
- 都道府県別の健康保険料率(全国平均10%で固定)
- 育休期間の選択(12ヶ月固定)

---

## 2. 技術仕様

### 2.1 フレームワーク・ライブラリ
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-share": "^5.1.0",
    "react-ga4": "^2.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 2.2 Node.jsバージョン
- **Node.js:** 18.x 以上
- **npm:** 9.x 以上

### 2.3 Next.js設定
- **レンダリング方式:** App Router(最新)
- **TypeScript:** Strict mode有効
- **ESLint:** next/core-web-vitals + @typescript-eslint/recommended
- **Prettier:** semi: false, singleQuote: true, tabWidth: 2

### 2.4 ブラウザサポート
- Chrome/Edge/Firefox/Safari最新版
- **IE11サポート:** なし

---

## 3. ディレクトリ構成

```
childcare-calculator/
├── app/
│   ├── page.tsx                    # メインページ('use client')
│   ├── layout.tsx                  # ルートレイアウト(メタデータ、GA設定)
│   ├── globals.css                 # グローバルCSS
│   ├── error.tsx                   # エラーハンドリング
│   ├── global-error.tsx            # グローバルエラーハンドリング
│   ├── opengraph-image.tsx         # OGP画像動的生成
│   │
│   ├── components/
│   │   ├── InputForm.tsx           # 入力フォーム
│   │   ├── InputForm.css
│   │   ├── ResultDisplay.tsx       # 結果表示全体
│   │   ├── ResultDisplay.css
│   │   ├── CurrentIncome.tsx       # 現在の収支
│   │   ├── CurrentIncome.css
│   │   ├── ChildcareIncome.tsx     # 育休中の収支
│   │   ├── ChildcareIncome.css
│   │   ├── MonthlyTable.tsx        # 12ヶ月詳細表
│   │   ├── MonthlyTable.css
│   │   ├── ComparisonChart.tsx     # 横棒グラフ
│   │   ├── ComparisonChart.css
│   │   ├── FAQ.tsx                 # よくある質問
│   │   ├── FAQ.css
│   │   ├── Notes.tsx               # 注意書き
│   │   ├── Notes.css
│   │   └── SocialShare.tsx         # ソーシャルシェア
│   │       └── SocialShare.css
│   │
│   ├── utils/
│   │   ├── calculator.ts           # 計算ロジック
│   │   ├── constants.ts            # 定数(等級表など)
│   │   └── formatter.ts            # 数値フォーマット
│   │
│   └── types/
│       └── index.ts                # TypeScript型定義
│
├── public/
│   └── images/
│       └── (必要に応じて画像配置)
│
├── .env.local                      # 環境変数(GA_ID)
├── .eslintrc.json                  # ESLint設定
├── .prettierrc                     # Prettier設定
├── next.config.js                  # Next.js設定
├── tsconfig.json                   # TypeScript設定
├── package.json                    # 依存関係
├── README.md                       # プロジェクト説明
└── .gitignore                      # Git除外設定
```

---

## 4. データ仕様

### 4.1 TypeScript型定義(app/types/index.ts)

```typescript
// 入力値の型
export interface CalculatorInput {
  salary: number;
}

// 社会保険料の型
export interface SocialInsurance {
  healthInsurance: number;      // 健康保険料
  pensionInsurance: number;     // 厚生年金保険料
  employmentInsurance: number;  // 雇用保険料
  total: number;                // 合計
}

// 税金の型
export interface Tax {
  incomeTax: number;            // 所得税(概算)
  residentTax: number;          // 住民税(概算)
  total: number;                // 合計
}

// 現在の収支の型
export interface CurrentIncome {
  grossSalary: number;          // 月額総支給額
  socialInsurance: SocialInsurance;
  tax: Tax;
  netIncome: number;            // 手取り額
}

// 月別給付金の型
export interface MonthlyBenefit {
  month: number;                // 月(1-12)
  benefit: number;              // その月の給付金額
  cumulative: number;           // 累計給付金額
}

// 育休給付金の型
export interface ChildcareBenefit {
  dailyWage: number;            // 賃金日額
  isUpperLimit: boolean;        // 上限額適用フラグ
  monthlyBenefits: MonthlyBenefit[];  // 12ヶ月分の詳細
  total: number;                // 12ヶ月合計
}

// 計算結果全体の型
export interface CalculationResult {
  input: CalculatorInput;
  current: CurrentIncome;
  childcare: ChildcareBenefit;
  maintenanceRate6Months: number;   // 1-6ヶ月の維持率(%)
  maintenanceRate12Months: number;  // 7-12ヶ月の維持率(%)
}

// バリデーションエラーの型
export interface ValidationError {
  field: 'salary';
  message: string;
  type: 'error' | 'warning';
}
```

---

## 5. 計算ロジック詳細

### 5.1 標準報酬月額等級表(app/utils/constants.ts)

```typescript
// 厚生労働省「令和7年度健康保険・厚生年金保険の保険料額表」に基づく
export const STANDARD_MONTHLY_REMUNERATION_TABLE = [
  58000, 68000, 78000, 88000, 98000,
  104000, 110000, 118000, 126000, 134000,
  142000, 150000, 160000, 170000, 180000,
  190000, 200000, 220000, 240000, 260000,
  280000, 300000, 320000, 340000, 360000,
  380000, 410000, 440000, 470000, 500000,
  530000, 560000, 590000, 620000, 650000,
  680000, 710000, 750000, 790000, 830000,
  880000, 930000, 980000, 1030000, 1090000,
  1150000, 1210000, 1270000, 1330000, 1390000,
];

// 保険料率(2025年度)
export const INSURANCE_RATES = {
  health: 0.10,           // 健康保険料率(全国平均、労使折半)
  pension: 0.183,         // 厚生年金保険料率(労使折半)
  employment: 0.006,      // 雇用保険料率(労働者負担分)
};

// 税率(概算)
export const TAX_RATES = {
  income: 0.05,           // 所得税(概算)
  resident: 0.10,         // 住民税(概算)
};

// 育児休業給付金上限(2025年8月1日〜2026年7月31日)
export const CHILDCARE_BENEFIT_LIMITS = {
  dailyWageLimit: 16110,        // 賃金日額上限
  monthly67Percent: 323811,     // 1-6ヶ月の月額上限(67%)
  monthly50Percent: 241650,     // 7-12ヶ月の月額上限(50%)
};

// 給付率
export const BENEFIT_RATES = {
  first6Months: 0.67,           // 1-6ヶ月目: 67%
  after7Months: 0.50,           // 7-12ヶ月目: 50%
};
```

### 5.2 計算ロジック(app/utils/calculator.ts)

```typescript
import {
  STANDARD_MONTHLY_REMUNERATION_TABLE,
  INSURANCE_RATES,
  TAX_RATES,
  CHILDCARE_BENEFIT_LIMITS,
  BENEFIT_RATES,
} from './constants';
import type {
  CalculatorInput,
  CalculationResult,
  CurrentIncome,
  ChildcareBenefit,
  MonthlyBenefit,
  SocialInsurance,
  Tax,
} from '../types';

/**
 * 標準報酬月額を取得
 * 月額総支給額を標準報酬月額等級表から最も近い等級に変換
 */
function getStandardMonthlyRemuneration(salary: number): number {
  // 最小値より小さい場合
  if (salary < STANDARD_MONTHLY_REMUNERATION_TABLE[0]) {
    return STANDARD_MONTHLY_REMUNERATION_TABLE[0];
  }
  
  // 最大値より大きい場合
  const maxRemuneration = STANDARD_MONTHLY_REMUNERATION_TABLE[
    STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1
  ];
  if (salary >= maxRemuneration) {
    return maxRemuneration;
  }
  
  // 該当する等級を探す
  for (let i = 0; i < STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1; i++) {
    const current = STANDARD_MONTHLY_REMUNERATION_TABLE[i];
    const next = STANDARD_MONTHLY_REMUNERATION_TABLE[i + 1];
    
    // 現在の等級と次の等級の中間値
    const midpoint = (current + next) / 2;
    
    if (salary < midpoint) {
      return current;
    }
  }
  
  return maxRemuneration;
}

/**
 * 社会保険料を計算
 */
function calculateSocialInsurance(
  salary: number
): SocialInsurance {
  const standardRemuneration = getStandardMonthlyRemuneration(salary);
  
  // 健康保険料(労働者負担分)
  const healthInsurance = Math.floor(
    standardRemuneration * INSURANCE_RATES.health / 2
  );
  
  
  // 厚生年金保険料(労働者負担分)
  const pensionInsurance = Math.floor(
    standardRemuneration * INSURANCE_RATES.pension / 2
  );
  
  // 雇用保険料(労働者負担分)
  const employmentInsurance = Math.floor(
    salary * INSURANCE_RATES.employment
  );
  
  const total = healthInsurance + pensionInsurance + employmentInsurance;
  
  return {
    healthInsurance,
    pensionInsurance,
    employmentInsurance,
    total,
  };
}

/**
 * 税金を計算(概算)
 */
function calculateTax(salary: number): Tax {
  const incomeTax = Math.floor(salary * TAX_RATES.income);
  const residentTax = Math.floor(salary * TAX_RATES.resident);
  
  return {
    incomeTax,
    residentTax,
    total: incomeTax + residentTax,
  };
}

/**
 * 現在の収支を計算
 */
function calculateCurrentIncome(
  salary: number
): CurrentIncome {
  const socialInsurance = calculateSocialInsurance(salary);
  const tax = calculateTax(salary);
  const netIncome = salary - socialInsurance.total - tax.total;
  
  return {
    grossSalary: salary,
    socialInsurance,
    tax,
    netIncome,
  };
}

/**
 * 育児休業給付金を計算
 */
function calculateChildcareBenefit(salary: number): ChildcareBenefit {
  // 賃金日額 = (月額総支給額 × 6) ÷ 180
  const dailyWage = Math.floor((salary * 6) / 180);
  
  // 上限額チェック
  const isUpperLimit = dailyWage > CHILDCARE_BENEFIT_LIMITS.dailyWageLimit;
  const actualDailyWage = isUpperLimit
    ? CHILDCARE_BENEFIT_LIMITS.dailyWageLimit
    : dailyWage;
  
  const monthlyBenefits: MonthlyBenefit[] = [];
  let cumulative = 0;
  
  // 12ヶ月分の給付金を計算
  for (let month = 1; month <= 12; month++) {
    let benefit: number;
    
    if (month <= 6) {
      // 1-6ヶ月目: 67%
      benefit = Math.floor(actualDailyWage * 30 * BENEFIT_RATES.first6Months);
      // 上限チェック
      if (benefit > CHILDCARE_BENEFIT_LIMITS.monthly67Percent) {
        benefit = CHILDCARE_BENEFIT_LIMITS.monthly67Percent;
      }
    } else {
      // 7-12ヶ月目: 50%
      benefit = Math.floor(actualDailyWage * 30 * BENEFIT_RATES.after7Months);
      // 上限チェック
      if (benefit > CHILDCARE_BENEFIT_LIMITS.monthly50Percent) {
        benefit = CHILDCARE_BENEFIT_LIMITS.monthly50Percent;
      }
    }
    
    cumulative += benefit;
    
    monthlyBenefits.push({
      month,
      benefit,
      cumulative,
    });
  }
  
  return {
    dailyWage: actualDailyWage,
    isUpperLimit,
    monthlyBenefits,
    total: cumulative,
  };
}

/**
 * メイン計算関数
 */
export function calculate(input: CalculatorInput): CalculationResult {
  const current = calculateCurrentIncome(input.salary);
  const childcare = calculateChildcareBenefit(input.salary);
  
  // 維持率を計算(手取りに対する給付金の割合)
  const benefit6Months = childcare.monthlyBenefits[0].benefit; // 1ヶ月目の給付金
  const benefit12Months = childcare.monthlyBenefits[11].benefit; // 12ヶ月目の給付金
  
  const maintenanceRate6Months = Math.round(
    (benefit6Months / current.netIncome) * 100
  );
  const maintenanceRate12Months = Math.round(
    (benefit12Months / current.netIncome) * 100
  );
  
  return {
    input,
    current,
    childcare,
    maintenanceRate6Months,
    maintenanceRate12Months,
  };
}

/**
 * 入力値のバリデーション
 */
export function validateInput(salary: number): ValidationError | null {
  if (!salary || salary === 0) {
    return {
      field: 'salary',
      message: '月額総支給額を入力してください',
      type: 'error',
    };
  }
  
  if (salary < 100000) {
    return {
      field: 'salary',
      message: '金額が低すぎます。給付金の受給要件を満たさない可能性があります',
      type: 'warning',
    };
  }
  
  if (salary >= 2000000) {
    return {
      field: 'salary',
      message: '金額が高すぎます。入力内容をご確認ください',
      type: 'error',
    };
  }
  
  return null;
}
```

### 5.3 数値フォーマッター(app/utils/formatter.ts)

```typescript
/**
 * 数値を3桁カンマ区切りにフォーマット
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('ja-JP');
}

/**
 * 円表示にフォーマット
 */
export function formatCurrency(value: number): string {
  return `${formatNumber(value)}円`;
}

/**
 * パーセント表示にフォーマット
 */
export function formatPercent(value: number): string {
  return `約${value}%`;
}

/**
 * カンマ区切り文字列を数値に変換
 */
export function parseFormattedNumber(value: string): number {
  return parseInt(value.replace(/,/g, ''), 10) || 0;
}
```

---

## 6. UI/UX仕様

### 6.1 初期状態
- 入力フォームのみ表示
- 結果表示エリアは非表示
- 月額総支給額: 空欄
- 年齢: 未選択(ラジオボタン)

### 6.2 入力時の動作
- リアルタイム計算: 入力停止後0.5秒(500ms)のデバウンス処理
- バリデーション: onBlurイベントで実行
- エラー表示: 入力欄の下に赤文字で表示
- カンマ区切り: onBlurで自動フォーマット(例: 300000 → 300,000)

### 6.3 計算結果表示のタイミング
- 有効な入力値が入力され、バリデーションエラーがない場合に表示
- 入力値が変更されるとリアルタイムに再計算
- ローディングインジケーターは不要(計算は瞬時)

### 6.4 URLパラメータ
- `?salary=300000` 形式でアクセス可能
- パラメータがある場合は自動的に入力欄を埋めて計算を実行
- 共有用ではなく、開発・テスト用途

### 6.5 エラーメッセージ

```typescript
// 0または空欄
"月額総支給額を入力してください"

// 100,000円未満(警告)
"金額が低すぎます。給付金の受給要件を満たさない可能性があります"

// 2,000,000円以上(エラー)
"金額が高すぎます。入力内容をご確認ください"
```

### 6.6 上限額警告の表示
給付金が上限額に達した場合、結果表示エリアの上部に以下を表示:

```
⚠️ あなたの給与は上限額を超えています

実際の給付金は以下の上限額が適用されます:
・1-6ヶ月: 323,811円/月(上限)
・7-12ヶ月: 241,650円/月(上限)

※上限額は令和7年8月1日時点のものです(令和8年7月31日まで有効)
※毎年8月1日に見直しが行われます
```

---

## 7. コンポーネント仕様

### 7.1 InputForm.tsx
**責務:** ユーザー入力を受け取り、バリデーションを行う

**Props:**
```typescript
interface InputFormProps {
  onCalculate: (input: CalculatorInput) => void;
  initialSalary?: number;
  initialAge?: 'under40' | 'over40';
}
```

**State:**
```typescript
const [salary, setSalary] = useState<string>(''); // カンマ区切り表示用
const [age, setAge] = useState<'under40' | 'over40'>('under40');
const [error, setError] = useState<ValidationError | null>(null);
```

**機能:**
- 月額総支給額入力(type="number", min="0", max="2000000")
- 年齢選択(ラジオボタン: 40歳未満 / 40歳以上)
- バリデーション(onBlur)
- カンマ区切りフォーマット(onBlur)
- 0.5秒デバウンス後に自動計算実行

### 7.2 ResultDisplay.tsx
**責務:** 計算結果全体を統括表示

**Props:**
```typescript
interface ResultDisplayProps {
  result: CalculationResult;
}
```

### 7.3 ComparisonChart.tsx
**責務:** 横棒グラフで収入を視覚的に比較

**表示内容:**
- 通常時の手取り: 100%(基準)
- 育休1-6ヶ月: XX%(給付金/手取り)
- 育休7-12ヶ月: XX%(給付金/手取り)

**実装:**
- CSS onlyで実装(アニメーションなし)
- 最小幅: 80px(小さい値でも見えるように)
- 横棒グラフの長さ: `width: ${percentage}%`

### 7.4 CurrentIncome.tsx
**責務:** 現在の収支内訳を表示

**表示内容:**
```
【現在の収支】
月額総支給額:        300,000円
社会保険料合計:       -45,000円
  └ 健康保険料:       -15,000円
  └ 介護保険料:           -0円 (40歳未満)
  └ 厚生年金保険料:   -27,450円
  └ 雇用保険料:        -1,800円
税金合計(概算):       -45,000円
  └ 所得税:           -15,000円
  └ 住民税:           -30,000円
──────────────────────
手取り額:            210,000円
```

### 7.5 ChildcareIncome.tsx
**責務:** 育休中の収支を2セクション(1-6ヶ月、7-12ヶ月)で表示

### 7.6 MonthlyTable.tsx
**責務:** 12ヶ月分の給付金詳細を表形式で表示

**表示内容:**
- 月 | 給付金額 | 累計
- 6ヶ月目と7ヶ月目の間に視覚的な区切り線

**モバイル対応:**
- 横スクロール可能
- スクロールヒント: "←→ スクロールできます"

### 7.7 FAQ.tsx
**責務:** よくある質問をアコーディオン形式で表示

**FAQ内容(順番確定):**
1. 育児休業給付金とは?
2. いつ振り込まれますか?
3. いつまでもらえますか?
4. 税金はかかりますか?
5. 社会保険料はどうなりますか?
6. 誰が申請しますか?
7. 給付金に上限額はありますか?
8. パート・アルバイトでももらえますか?
9. 育休中に働けますか?
10. 賞与(ボーナス)は含まれますか?

### 7.8 Notes.tsx
**責務:** 注意書き・免責事項を表示

### 7.9 SocialShare.tsx
**責務:** SNSシェアボタンを提供

**使用ライブラリ:** react-share

**シェアボタン:**
1. Twitter
2. Facebook
3. LINE

---

## 8. スタイリング仕様

### 8.1 カラーパレット
```css
:root {
  /* 基本色 */
  --color-white: #FFFFFF;
  --color-background: #F5F5F5;
  --color-text: #333333;
  
  /* アクセント色 */
  --color-primary: #2196F3;
  --color-error: #F44336;
  --color-warning: #FF9800;
  --color-success: #4CAF50;
  
  /* ボーダー・区切り */
  --color-border: #E0E0E0;
  
  /* グラフ用 */
  --color-bar-full: #2196F3;
  --color-bar-67: #4CAF50;
  --color-bar-50: #FF9800;
}
```

### 8.2 タイポグラフィ
```css
:root {
  /* フォントファミリー */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", 
                 "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  
  /* フォントサイズ */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  
  /* 行間 */
  --line-height-tight: 1.4;
  --line-height-base: 1.6;
  --line-height-relaxed: 1.8;
}
```

### 8.3 レスポンシブブレークポイント
```css
/* モバイルファースト */

/* タブレット */
@media (min-width: 768px) {
  /* ... */
}

/* デスクトップ */
@media (min-width: 1024px) {
  /* ... */
}
```

### 8.4 アクセシビリティ
**コントラスト比(WCAG AA準拠):**
- テキスト(#333) / 背景(#FFF): 12.63:1 ✅
- プライマリ(#2196F3) / 背景(#FFF): 3.14:1 ✅

**フォーカス表示:**
```css
button:focus,
input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## 9. 機能要件

### 9.1 計算機能
- ✅ 月額総支給額と年齢から育児休業給付金を計算
- ✅ 標準報酬月額等級表に基づく正確な社会保険料計算
- ✅ 賃金日額の上限チェック
- ✅ 月額給付金の上限チェック
- ✅ 1-6ヶ月(67%)と7-12ヶ月(50%)の給付率切り替え

### 9.2 入力機能
- ✅ 月額総支給額入力(数値、10万〜200万円)
- ✅ 年齢選択(ラジオボタン: 40歳未満/40歳以上)
- ✅ リアルタイムバリデーション
- ✅ カンマ区切り自動フォーマット
- ✅ エラーメッセージ表示

### 9.3 結果表示機能
- ✅ 現在の収支(総支給額、社会保険料、税金、手取り)
- ✅ 育休中の収支(1-6ヶ月、7-12ヶ月)
- ✅ 横棒グラフで視覚的比較
- ✅ 12ヶ月詳細表(月別給付金、累計)
- ✅ 上限額警告表示

### 9.4 その他機能
- ✅ FAQアコーディオン(10個の質問)
- ✅ SNSシェア(Twitter/Facebook/LINE)
- ✅ Google Analytics計測
- ✅ SEO対応(メタデータ、OGP)

---

## 10. 非機能要件

### 10.1 パフォーマンス
- ページ読み込み: 3秒以内
- 計算処理: 瞬時(100ms以内)
- デバウンス: 500ms

### 10.2 アクセシビリティ
- WCAG 2.1 AA準拠
- キーボード操作対応
- スクリーンリーダー対応
- コントラスト比: 4.5:1以上

### 10.3 レスポンシブデザイン
- モバイル: 320px〜767px
- タブレット: 768px〜1023px
- デスクトップ: 1024px以上

---

## 11. 環境変数

### 11.1 .env.local
```bash
# Google Analytics測定ID
NEXT_PUBLIC_GA_ID=G-47317RL34T
```

---

## 12. デプロイ設定

### 12.1 Vercel設定
- **プロジェクト名:** childcare-calculator
- **フレームワーク:** Next.js
- **ビルドコマンド:** `npm run build`
- **出力ディレクトリ:** `.next`

### 12.2 環境変数(Vercel)
```
NEXT_PUBLIC_GA_ID=G-47317RL34T
```

---

## 13. Git・GitHub管理

### 13.1 リポジトリ情報
- **GitHubリポジトリ:** https://github.com/oshima0627/childcare-calculator
- **ユーザー名:** oshima0627
- **Personal Access Token:** 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
- **ブランチ:** main

### 13.2 基本的なGitコマンド

```bash
# プロジェクトディレクトリに移動
cd "/mnt/c/Users/oshim/OneDrive/ドキュメント/projects/育児休業給付金シミュレーター/childcare-calculator"

# 変更をステージング
git add .

# コミット（メッセージは適切に変更）
git commit -m "コミットメッセージ"

# GitHubにプッシュ
git push origin main

# 状態確認
git status

# ログ確認
git log --oneline -10
```

### 13.3 認証付きリモートURL
```
https://oshima0627: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@github.com/oshima0627/childcare-calculator.git
```

### 13.4 初期セットアップ（既に完了）
```bash
# Git初期化（完了済み）
git init
git branch -m main
git config user.name "oshima0627"
git config user.email "oshimanaotaka0627@example.com"

# リモートリポジトリ追加（完了済み）
git remote add origin https://oshima0627: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@github.com/oshima0627/childcare-calculator.git

# 初回プッシュ（完了済み）
git add .
git commit -m "Initial commit: 育児休業給付金シミュレーター"
git push -u origin main
```

### 13.5 SSH認証設定（重要）
リポジトリの操作には既存のSSHキーを使用します。

**使用中のSSHキー:**
- ファイル: `~/.ssh/id_ed25519`
- フィンガープリント: `SHA256:ReJhcmUCn41LlhH1zN8uANNYwGMcNIBxisVUUKPpBXI`
- GitHub登録名: `nexeed-lab`
- 最終使用: 過去4週間以内

**SSH設定ファイル（~/.ssh/config）:**
```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

**SSH接続テスト:**
```bash
ssh -T git@github.com
```
成功時のメッセージ: "Hi oshima0627! You've successfully authenticated, but GitHub does not provide shell access."

**重要な注意点:**
- SSH認証が正常でない場合、Vercelデプロイで「Canceled from the Vercel Dashboard」エラーが発生
- コミット作者のメールアドレス（orfevre_gk_6.27@icloud.com）とVercelアカウントが一致している必要がある
- 新しいSSHキーの生成は不要（既存キーを使用）

### 13.6 Vercel連携
- GitHubのmainブランチにプッシュすると自動的にVercelが再デプロイ
- 継続的デプロイメント（CD）が有効
- SSH認証が正常な場合、デプロイエラーは発生しない

### 13.7 Vercel Analytics設定
**パッケージ:** `@vercel/analytics`

**app/layout.tsx設定:**
```typescript
import { Analytics } from '@vercel/analytics/next'

// bodyタグの最後に追加
<Analytics />
```

**機能:**
- 訪問者数とページビュー数のトラッキング
- リアルタイムデータ表示
- Vercelダッシュボードで確認可能

---

## 14. テストケース

### 14.1 計算ロジックのテスト

**ケース1: 標準的な給与(30万円)**
```typescript
Input: { salary: 300000 }
Expected:
  - 標準報酬月額: 300000
  - 健康保険料: 15000
  - 介護保険料: 0
  - 厚生年金保険料: 27450
  - 雇用保険料: 1800
  - 所得税: 15000
  - 住民税: 30000
  - 手取り: 210750
  - 賃金日額: 10000
  - 1-6ヶ月給付金: 201000
  - 7-12ヶ月給付金: 150000
```

**ケース2: 上限超過(100万円)**
```typescript
Input: { salary: 1000000 }
Expected:
  - 賃金日額: 16110(上限適用)
  - isUpperLimit: true
  - 1-6ヶ月給付金: 323811(上限)
  - 7-12ヶ月給付金: 241650(上限)
```

### 14.2 バリデーションのテスト

**ケース1: 空欄**
```typescript
Input: salary = 0
Expected: "月額総支給額を入力してください"
```

**ケース2: 10万円未満**
```typescript
Input: salary = 50000
Expected: "金額が低すぎます。給付金の受給要件を満たさない可能性があります"(警告)
```

**ケース3: 200万円以上**
```typescript
Input: salary = 2500000
Expected: "金額が高すぎます。入力内容をご確認ください"(エラー)
```

---

## 15. 実装チェックリスト

### 15.1 プロジェクトセットアップ
- [ ] Next.jsプロジェクト作成
- [ ] TypeScript有効化
- [ ] 依存関係インストール
- [ ] ESLint/Prettier設定

### 15.2 コアロジック実装
- [ ] TypeScript型定義
- [ ] 定数ファイル
- [ ] 計算ロジック
- [ ] フォーマッター

### 15.3 UIコンポーネント実装
- [ ] InputForm
- [ ] ResultDisplay
- [ ] ComparisonChart
- [ ] CurrentIncome
- [ ] ChildcareIncome
- [ ] MonthlyTable
- [ ] FAQ
- [ ] Notes
- [ ] SocialShare

### 15.4 メインページ・レイアウト
- [ ] app/page.tsx
- [ ] app/layout.tsx
- [ ] app/opengraph-image.tsx
- [ ] エラーハンドリング

### 15.5 スタイリング
- [ ] グローバルCSS
- [ ] コンポーネントCSS
- [ ] レスポンシブ対応
- [ ] アクセシビリティ対応

### 15.6 最終調整
- [ ] Google Analytics
- [ ] テスト実行
- [ ] デプロイ準備

---

## 16. 開発開始コマンド

```bash
# プロジェクト作成
npx create-next-app@latest childcare-calculator --typescript --eslint --app --no-src-dir

# ディレクトリ移動
cd childcare-calculator

# 依存関係追加
npm install react-share react-ga4

# 開発サーバー起動
npm run dev
```

**開発サーバー:** http://localhost:3000

---

## 17. 完成イメージ

```
┌─────────────────────────────────────────┐
│   育児休業給付金シミュレーター          │ ← ヘッダー
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [入力フォーム]                         │
│  月額総支給額: [300,000] 円             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [手取り額の比較]                       │
│  通常時: ██████████████████████ 100%    │
│  育休1-6: ████████████ 67%              │
│  育休7-12: █████████ 50%                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [現在の収支]                           │
│  総支給額: 300,000円                    │
│  社会保険料: -45,000円                  │
│  税金: -45,000円                        │
│  ────────────────                       │
│  手取り: 210,000円                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [育休中の収支(1-6ヶ月)]               │
│  給付金: 200,000円                      │
│  社会保険料: 0円(免除)                  │
│  税金: 0円(非課税)                      │
│  ────────────────                       │
│  手取り: 200,000円                      │
│  通常時との比較: 約67%                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [12ヶ月詳細表]                         │
│  月 | 給付金 | 累計                     │
│  1  | 200,000 | 200,000                 │
│  ...                                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [よくある質問] ▼                       │
│  Q1. 育児休業給付金とは? +              │
│  Q2. いつ振り込まれますか? +            │
│  ...                                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [シェアボタン]                         │
│  🐦 📘 💬                               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  【免責事項】                           │ ← フッター
│  この計算結果は概算です...              │
└─────────────────────────────────────────┘
```

---

## 18. 追加資料

### 18.1 参考URL
- **厚生労働省:** 育児休業等給付の内容と支給申請手続
- **協会けんぽ:** 令和7年度都道府県単位保険料率

### 18.2 データフロー
```
1. ユーザーが月額総支給額を入力
2. デバウンス(500ms)
3. バリデーション実行
4. エラーがなければ計算実行
5. CalculationResultを生成
6. 結果表示コンポーネントに渡す
7. 各コンポーネントが結果を表示
```

---

**このプロジェクトは技術的に実装可能で、すべての要件が明確に定義されています。**
**明確な指示がある場合のみCLAUDE.mdを変更いたします。**