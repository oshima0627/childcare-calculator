# デプロイメントガイド

## 🚀 Vercelへのデプロイ（推奨）

### 1. Vercelアカウント準備
1. [Vercel](https://vercel.com)でアカウント作成
2. GitHubアカウントと連携

### 2. プロジェクト作成
```bash
# Vercel CLIインストール
npm i -g vercel

# プロジェクトルートでログイン
vercel login

# デプロイ実行
vercel
```

### 3. 環境変数設定
Vercelダッシュボードで以下を設定：

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=verification_code
```

### 4. 自動デプロイ設定
- mainブランチへのプッシュで自動デプロイ
- プレビューデプロイは全ブランチで実行

## 📊 Google Analytics設定

### 1. GA4プロパティ作成
1. [Google Analytics](https://analytics.google.com)でプロパティ作成
2. 測定IDをコピー（G-XXXXXXXXXX）

### 2. 環境変数設定
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. 追跡イベント
自動で以下のイベントを送信：
- `calculate`: 計算実行時
- `share`: ソーシャル共有時

## 🔍 Google Search Console設定

### 1. プロパティ登録
1. [Search Console](https://search.google.com/search-console)でドメイン追加
2. HTML確認コードを取得

### 2. 環境変数設定
```
NEXT_PUBLIC_GOOGLE_VERIFICATION=verification_code
```

## 🌐 カスタムドメイン設定

### Vercelでのドメイン設定
1. Vercelダッシュボードでドメイン追加
2. DNSレコード設定：
   ```
   Type: CNAME
   Name: www (または @)
   Value: cname.vercel-dns.com
   ```

### SSL証明書
- Vercelが自動でLet's Encrypt証明書を発行
- 設定後24時間以内に有効化

## 📈 パフォーマンス最適化

### 1. ビルド最適化
- CSS最適化: `optimizeCss: true`
- パッケージ最適化: `optimizePackageImports`
- 画像最適化: WebP/AVIF対応

### 2. キャッシュ戦略
- 静的リソース: 1年キャッシュ
- HTMLページ: キャッシュ無効

### 3. Core Web Vitals対策
- フォント最適化（preconnect）
- CLS対策（レイアウトシフト防止）
- 遅延読み込み対応

## 🔒 セキュリティ設定

### 1. セキュリティヘッダー
Next.jsが自動で設定：
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### 2. HTTPS強制
Vercelが自動でHTTPSリダイレクト

## 📱 PWA対応（将来的）

### Service Worker準備
- `next-pwa`パッケージ追加
- オフライン対応
- プッシュ通知

## 🐛 トラブルシューティング

### よくある問題

#### ビルドエラー
```bash
# 依存関係再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 型エラー
```bash
# 型チェック実行
npm run type-check
```

#### 環境変数が反映されない
1. `.env.local`ファイル確認
2. `NEXT_PUBLIC_`プレフィックス確認
3. Vercelダッシュボードで設定確認

### ログ確認
```bash
# Vercelログ確認
vercel logs
```

## 📊 監視・分析

### 1. Vercel Analytics
- Core Web Vitals監視
- パフォーマンス分析

### 2. Google Analytics
- ユーザー行動分析
- コンバージョン追跡

### 3. Search Console
- 検索パフォーマンス
- インデックス状況

## 🔄 更新・メンテナンス

### 定期更新項目
1. **保険料率**（年1回、4月）
2. **給付金上限額**（年1回、8月）
3. **標準報酬月額等級表**（必要に応じて）

### 更新手順
1. `constants.ts`でデータ更新
2. 計算テスト実行
3. プルリクエスト作成
4. レビュー・マージ
5. 自動デプロイ実行

---

**注意**: 本番環境では必ず最新の制度情報を確認してから更新してください。