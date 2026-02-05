# X Eyes — Firefox アドオン

## 概要

「X Eyes」は Firefox 用のブラウザ拡張機能です。
x.com の個別ツイートURL（`x.com/{user}/status/{id}` 形式）を開いた際に、X のページを読み込まず、拡張機能が提供するビューアページ `moz-extension://{uuid}/x-eyes.html` にリダイレクトし、ツイートの内容だけをクリーンに表示します。

## 動作フロー

1. ユーザーが `x.com/{user}/status/{id}` にマッチする URL をブラウザで開く
2. Background Script が `webRequest.onBeforeRequest` でリクエストをインターセプト
3. 元のリクエストをキャンセルし、`tabs.update` で同じタブを `moz-extension://{uuid}/x-eyes.html?url={元のURL}` にナビゲート
4. ビューアページが URL のクエリパラメータを解析し、`api.fxtwitter.com` の API を使ってツイートデータを取得
5. 取得したデータをカード形式で画面中央に表示

### リダイレクト実装

- **方式**: `webRequest.onBeforeRequest` + `tabs.update`（Manifest V3）
- Manifest V3 の `declarativeNetRequest` では `moz-extension://` へのリダイレクトに制限があるため、webRequest API を使用
- 無限ループ防止のため、リダイレクト中のタブIDを `Set` で追跡
- 対象 URL パターン: `*://x.com/*/status/*` および `*://twitter.com/*/status/*`

## API

- エンドポイント: `https://api.fxtwitter.com/{user}/status/{id}`
- 認証不要
- レスポンスは JSON で、ツイート本文・メディア・ユーザー情報などを含む

## 表示する情報

- ユーザーアイコン（アバター画像）
- ユーザー名 / スクリーンネーム（@handle）
- ツイート本文
- 添付画像（複数対応、グリッド表示）
- 添付動画（インライン再生）
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
| ビルド | Vite + @samrum/vite-plugin-web-extension |
| パッケージング / 開発サーバー | web-ext（Mozilla 公式） |
| CSS フレームワーク | Bootstrap 5 |
| 拡張機能マニフェスト | Manifest V3 |

### 依存関係

```json
{
  "dependencies": {
    "bootstrap": "^5.3.8",
    "vue": "^3.5.27"
  },
  "devDependencies": {
    "@samrum/vite-plugin-web-extension": "^5.1.1",
    "@vitejs/plugin-vue": "^6.0.4",
    "typescript": "^5.9.3",
    "vite": "^7.3.1",
    "vue-tsc": "^3.2.4",
    "web-ext": "^9.2.0",
    "web-ext-types": "^3.2.1"
  }
}
```

## 開発コマンド

```bash
# 開発（Vite watch モード）
npm run dev

# Firefox で動作確認（Vite watch + web-ext run 並行実行）
npm run dev:firefox

# 本番ビルド
npm run build

# 拡張機能パッケージ作成（dist → web-ext-artifacts/*.zip）
npm run build:firefox

# TypeScript 型チェック
npm run lint
```

## UI 仕様

- 画面中央にツイートカードを 1 枚表示するシンプルなレイアウト
- カードの最大幅は 600px 程度
- 配色は OS のカラースキーム設定（`prefers-color-scheme`）に追従
  - ダークモード: 暗い背景 + 明るいテキスト
  - ライトモード: 明るい背景 + 暗いテキスト
- 画像は複数枚ある場合グリッド表示（1枚/2枚横並び/3-4枚2x2グリッド）
- 動画はインラインで再生可能
- 引用ツイートはカード内に入れ子のカードとして表示
- ローディング中はスピナーで待機状態を示す
- API エラー時はエラーメッセージを表示し、元の x.com URL へのリンクを提示

## プロジェクト構成

```
x-eyes/
├── src/
│   ├── background/
│   │   └── index.ts           # webRequest によるリダイレクト処理
│   ├── viewer/
│   │   ├── App.vue            # メインコンポーネント
│   │   ├── main.ts            # Vue アプリエントリポイント
│   │   ├── components/
│   │   │   ├── TweetCard.vue      # ツイートカード
│   │   │   ├── QuotedTweet.vue    # 引用ツイート
│   │   │   ├── MediaGrid.vue      # 画像グリッド
│   │   │   └── VideoPlayer.vue    # 動画プレイヤー
│   │   ├── api/
│   │   │   └── fxtwitter.ts   # API クライアント + 型定義
│   │   └── styles/
│   │       └── main.css       # ダーク/ライトモード対応スタイル
│   ├── types/
│   │   └── browser.d.ts       # browser API 型定義（webRequest等）
│   └── vite-env.d.ts          # Vite 環境型定義
├── public/
│   └── icons/
│       ├── icon-48.png
│       └── icon-96.png
├── dist/                      # ビルド出力（.gitignore）
├── web-ext-artifacts/         # パッケージ出力（.gitignore）
├── x-eyes.html                # ビューアページ HTML
├── vite.config.ts             # Vite + manifest 設定
├── tsconfig.json
├── tsconfig.node.json
├── web-ext-config.mjs         # web-ext 設定
├── package.json
└── .gitignore
```

## manifest 設定（vite.config.ts 内）

```typescript
{
  manifest_version: 3,
  name: 'X Eyes',
  version: '1.0.0',
  browser_specific_settings: {
    gecko: {
      id: 'x-eyes@example.com',
      strict_min_version: '113.0'
    }
  },
  permissions: ['webRequest', 'webRequestBlocking', 'webNavigation', 'tabs'],
  host_permissions: [
    '*://x.com/*',
    '*://twitter.com/*',
    'https://api.fxtwitter.com/*',
    'https://pbs.twimg.com/*',
    'https://video.twimg.com/*'
  ],
  background: {
    scripts: ['src/background/index.ts'],
    type: 'module'
  },
  web_accessible_resources: [{
    resources: ['x-eyes.html'],
    matches: ['*://x.com/*', '*://twitter.com/*']
  }]
}
```

## 補足事項

- `api.fxtwitter.com` への fetch は拡張機能ページから行うため、`host_permissions` に適切なオリジンを追加済み
- 画像・動画の直接読み込みのため `pbs.twimg.com` / `video.twimg.com` も `host_permissions` に追加
- ビューアページ（x-eyes.html）は `web_accessible_resources` に含める必要がある（webRequest からのリダイレクト先として使用するため）
