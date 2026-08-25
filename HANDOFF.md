# HANDOFF

最終更新: 2026-08-25

## いま何をしているのか

検索エンジンにサイトを認識させるための最低限の設定（robots.txt / sitemap.xml）を整えている。
このリポジトリは 4リポジトリ中で唯一 robots.txt が正しく配信できていた（`public/robots.txt`）。
今回は他リポジトリと方式を揃え、ドメインの定義を1か所（`APP_CONFIG.url`）に寄せた。

## 今回やったこと

- `app/robots.ts` を新規作成（`MetadataRoute.Robots`、`dynamic = 'force-static'`）
- `public/robots.txt` を削除（`app/robots.ts` と同じ `/robots.txt` を取り合うため両立できない）
  - 削除した旧ファイルには `Crawl-delay: 1` と、`*` と同内容の Googlebot / Bingbot ブロックがあった。
    Google は `Crawl-delay` を無視し、Bing に対しては不要にクロールを遅らせるだけなので引き継がなかった
- `app/sitemap.ts` は**変更していない**。理由は下記「検証済みの事実」参照
- `npm ci` → `npm run build` → `npx wrangler dev --local` で実際に配信して確認

## 検証済みの事実（実際に画面に出した出力のみ）

- `npm run build` 成功。Route 一覧に `/`, `/_not-found`, `/apple-icon.png`, `/opengraph-image`,
  `/robots.txt`, `/sitemap.xml` が並んだ
- **このアプリのページは `app/page.tsx` の1枚だけ**。ビルド後の `out/*.html` も `index.html` / `404.html` のみ。
  したがって sitemap.xml の URL が1件（トップのみ）なのは**実態と一致しており、正しい**。
  水増しできる実在ページは無い
- `out/robots.txt` の中身:

  ```
  User-Agent: *
  Allow: /

  Sitemap: https://childcare.nexeed-lab.com/sitemap.xml
  ```

- `out/sitemap.xml` の中身:

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
  <loc>https://childcare.nexeed-lab.com</loc>
  <lastmod>2026-08-25T06:04:18.073Z</lastmod>
  <changefreq>weekly</changefreq>
  <priority>1</priority>
  </url>
  </urlset>
  ```

- `npx wrangler dev --local --port 8795`（本番と同じ `wrangler.jsonc` を使うローカル配信）に対する実測:

  ```
  PATH /robots.txt  -> HTTP 200 text/plain; charset=utf-8    78bytes
  PATH /sitemap.xml -> HTTP 200 application/xml             266bytes
  PATH /            -> HTTP 200 text/html; charset=utf-8  28361bytes
  ```

  返ってきた `/robots.txt` の本文は上記 `out/robots.txt` と同一（＝旧 `public/robots.txt` ではなく新しい方が配信されている）
- `npm run lint`（0 errors / 13 warnings、既存の未使用変数warningのみ）、`npm run type-check` 無出力（成功）、
  `npm test` 34 passed（1ファイル）
- ビルド中に `Failed to load dynamic font ... Status: 400` が出るが、これは `app/opengraph-image.tsx` の
  フォント取得（ネットワーク）に関する警告で、ビルドは成功している（既存の挙動、今回の変更とは無関係）

## 未検証のもの

- **本番へのデプロイは実行していない。** 上記は全てローカルの `wrangler dev` での実測
- Cloudflare 側で GitHub 連携（Workers Builds）が有効かどうかはリポジトリからは判定できない。
  有効なら `git push` で自動デプロイされる可能性がある（`.github/workflows/ci.yml` は lint/typecheck/test のみでデプロイしない）
- sitemap の `lastmod` はビルド時刻（`new Date()`）。中身が変わっていなくてもビルドのたびに更新される。今回は手を入れていない

## 次にやること

1. デプロイする（本人が判断して実行）:

   ```bash
   cd C:/Users/oshim/Documents/projects/childcare-calculator
   npx wrangler login   # 初回のみ
   npm run deploy       # next build → wrangler deploy
   ```

2. デプロイ後に実測で確認する:

   ```bash
   curl -s https://childcare.nexeed-lab.com/robots.txt
   curl -s https://childcare.nexeed-lab.com/sitemap.xml
   ```

3. 表示34 / クリック0 という現状はページが1枚しかないことが根本原因。
   robots/sitemap を直しても順位は上がらない。次はコンテンツ（実在ページ）を増やすかどうかの判断

## 触ってはいけないところ

- `next.config.js` の `output: 'export'`。Cloudflare Workers の静的アセット配信（`wrangler.jsonc` の `assets.directory: "./out"`）が
  この出力を前提にしている
- `public/robots.txt` を復活させない。`app/robots.ts` と衝突する
- `app/robots.ts` / `app/sitemap.ts` の `export const dynamic = 'force-static'` を外さない
- `DEPLOYMENT.md` の Vercel 手順は旧構成の記録。現行は Cloudflare（`CLOUDFLARE.md`）
