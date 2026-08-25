# HANDOFF

最終更新: 2026-08-25

## いま何をしているのか

育休ナビ（ikunavi）への長尾コンテンツ統合（Task 8）。このリポジトリの育児休業給付金シミュレーターは
育休ナビの `/calculator` に統合され、このサイト自体は廃止する。
Next.js の静的サイトを配信していた Cloudflare Worker を、全パスを 301 リダイレクトするだけの
最小 Worker に差し替えた。

## 今回やったこと

- `worker.ts` を新規作成。`fetch()` が常に `https://ikunavi.nexeed-lab.com/calculator` へ
  `Response.redirect(TARGET, 301)` を返すだけの Worker
- `wrangler.jsonc` から `assets`（`directory: "./out"` の静的アセット配信設定）を削除し、
  代わりに `"main": "worker.ts"` を設定。`custom_domain` はもともとこのファイルに記載がないため
  変更なし（Cloudflare ダッシュボード側の設定として別途存在する）
- `package.json` の `deploy` スクリプトを `"npm run build && wrangler deploy"` から
  `"wrangler deploy"` に変更（リダイレクト専用 Worker には Next.js のビルドが不要なため）。
  `preview` スクリプト（`npm run build && wrangler dev`）は今回の対象外のため変更していない
- `app/`・`out/` の Next.js コードは削除していない。統合を撤回する場合に備えてリポジトリに残す

## 検証済みの事実（実際に画面に出した出力のみ）

- `npx wrangler dev --port 8788` を起動し、以下を実測:

  ```
  curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:8788/
  301 -> https://ikunavi.nexeed-lab.com/calculator

  curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:8788/any/path
  301 -> https://ikunavi.nexeed-lab.com/calculator
  ```

  ルートパス・任意パスの両方が期待どおり 301 でリダイレクトされることを確認した。
  確認後、`wrangler dev` が起動した bash / node / workerd プロセスは全て停止済み
- `git status` はこの変更を加える前の時点でクリーン（`main` ブランチ、リモートと同期済み）だった

## 未検証のもの

- **本番へのデプロイは実行していない。** 上記はすべてローカルの `wrangler dev` での実測であり、
  本番の `https://childcare.nexeed-lab.com/` が実際に 301 で `ikunavi.nexeed-lab.com` へ飛ぶことは未確認
- Cloudflare ダッシュボード側の `custom_domain`（`childcare.nexeed-lab.com`）設定が
  `assets` を外した Worker に対しても引き続き有効かどうかは、統括者の事前調査に基づく前提であり、
  このリポジトリからは検証できていない
- ikunavi 側の `/calculator` ページが実装済みかどうかはこのリポジトリからは確認していない

## 次にやること

**デプロイは ikunavi のデプロイ後に行うこと。** 先にリダイレクトを出すと送り先が404になる。

デプロイ自体は次の手順（本人が判断して実行）:

```bash
cd C:/Users/oshim/Documents/projects/childcare-calculator
npx wrangler deploy
```

デプロイ後は実測で確認する:

```bash
curl -sI https://childcare.nexeed-lab.com/
curl -sI https://childcare.nexeed-lab.com/any/path
```

## 触ってはいけないところ

- `app/` 以下の Next.js コードと `out/`（存在する場合）は削除しない。統合を撤回する場合に戻せるよう
  リポジトリに残してある
- `next.config.js` の `output: 'export'` は変更しない。Worker を元の静的配信に戻す可能性があるため
- `worker.ts` の `TARGET` は `https://ikunavi.nexeed-lab.com/calculator` 固定。
  他の統合先 URL と混同しないこと（maternity-allowance-calculator リポジトリの送り先は
  `/calculator/maternity`）
- ルート直下の `CLAUDE.md` は 2025年12月時点の初期要件定義書であり、現行のリポジトリ実態
  （Next.js バージョンや Vercel 記述など）とは既にズレている。今回は参照のみで変更していない
