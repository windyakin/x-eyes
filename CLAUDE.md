# X Eyes — Firefox アドオン 新規プロジェクト作成

## 概要

「X Eyes」は Firefox 用のブラウザ拡張機能です。
x.com の個別ツイートURL（`x.com/{user}/status/{id}` 形式）を開いた際に、X のページを読み込まず、拡張機能が提供するビューアページ `moz-extension://{uuid}/x-eyes.html` にリダイレクトし、ツイートの内容だけをクリーンに表示します。

## 動作フロー

1. ユーザーが `x.com/{user}/status/{id}` にマッチする URL をブラウザで開く
2. 拡張機能がナビゲーションをインターセプトし、同じタブで `moz-extension://{uuid}/x-eyes.html?url={元のURL}` にリダイレクトする
3. ビューアページが URL のクエリパラメータを解析し、`api.fxtwitter.com` の API を使ってツイートデータを取得する
4. 取得したデータをカード形式で画面中央に表示する

### リダイレクトの実装方針

- Firefox の Multi-Account Containers アドオンが、コンテナタブ設定済み URL を開いたときに確認画面（拡張機能ページ）へリダイレクトするのと同様の手法を参考にすること
- Manifest V3 の `declarativeNetRequest` や `webRequest` で `moz-extension://` ページへのリダイレクトが実現できるならば Manifest V3 を採用する
- V3 で技術的に不可能な場合は Manifest V2（`webRequest.onBeforeRequest` + `redirectUrl`）で実装して構わない
- 対象 URL パターン: `*://x.com/*/status/*` および `*://twitter.com/*/status/*`

## API

- エンドポイント: `https://api.fxtwitter.com/{user}/status/{id}`
- 認証不要
- レスポンスは JSON で、ツイート本文・メディア・ユーザー情報などを含む
- 実装前に上記エンドポイントのレスポンス構造を実際にリクエストして確認し、それに基づいて型定義・表示ロジックを組むこと

## 表示する情報（これだけ。他は一切不要）

- ユーザーアイコン（アバター画像）
- ユーザー名 / スクリーンネーム（@handle）
- ツイート本文
- 添付画像（複数対応）
- 添付動画
- 引用ツイート（入れ子カードとして表示）

### 表示しないもの

- いいね数、リツイート数、リプライ数などのエンゲージメント指標
- リプライツリー
- おすすめ、トレンド、サイドバーなど X 本来の UI 要素
- 広告

## 技術スタック

| 領域 | 技術 |
|---|---|
| ビューアページ UI | Vue.js 3 (Composition API, TypeScript) |
| Background Script | TypeScript（Vite でビルド） |
| ビルド | Vite（+ ブラウザ拡張向けプラグイン。例: `vite-plugin-web-extension` など適切なものを選定） |
| パッケージング / 開発サーバー | `web-ext`（Mozilla 公式の拡張機能開発ツール） |
| CSS フレームワーク | Bootstrap 5 |
| 拡張機能マニフェスト | Manifest V3 優先、不可なら V2 |

### web-ext の利用

- `web-ext run` で開発中の動作確認（Firefox の一時的な拡張機能読み込み）を行えるようにすること
- `web-ext build` で配布用 `.zip` / `.xpi` を生成できるようにすること
- `package.json` の scripts に以下のようなコマンドを用意すること:
  - `dev` — Vite のビルド（watch モード）+ `web-ext run` を並行実行
  - `build` — Vite の本番ビルド + `web-ext build`
- `web-ext` の設定（`sourceDir` を Vite の出力ディレクトリに向けるなど）は `web-ext-config.mjs` またはそれに相当するファイルで管理する

## UI 仕様

- 画面中央にツイートカードを 1 枚表示するシンプルなレイアウト
- カードの最大幅は 600px 程度
- 配色は OS のカラースキーム設定（`prefers-color-scheme`）に追従する
  - ダークモード: 暗い背景 + 明るいテキスト
  - ライトモード: 明るい背景 + 暗いテキスト
- 画像は複数枚ある場合グリッド表示
- 動画はインラインで再生可能にする
- 引用ツイートはカード内に入れ子のカードとして表示する
- ローディング中はスピナーなどで待機状態を示す
- API エラー時はエラーメッセージを表示し、元の x.com URL へのリンクを提示する

## プロジェクト構成（参考）

```
x-eyes/
├── src/
│   ├── background/          # Service Worker / Background Script (TypeScript)
│   │   └── index.ts
│   ├── viewer/              # ビューアページ (x-eyes.html)
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── components/
│   │   │   ├── TweetCard.vue
│   │   │   ├── QuotedTweet.vue
│   │   │   ├── MediaGrid.vue
│   │   │   └── VideoPlayer.vue
│   │   └── api/
│   │       └── fxtwitter.ts # API クライアント + 型定義
│   └── assets/
├── public/
│   └── icons/
├── manifest.json
├── vite.config.ts
├── tsconfig.json
├── web-ext-config.mjs       # web-ext の設定
└── package.json
```

## 補足事項

- `api.fxtwitter.com` への fetch は拡張機能ページから行うため、manifest の `permissions` または `host_permissions` に適切なオリジンを追加すること
- ビューアページの HTML ファイル（x-eyes.html）は `web_accessible_resources` に含める必要はない（拡張機能自身のページなので）。ただしリダイレクト先として使うために manifest で適切に登録すること
