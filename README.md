# X Eyes

X Eyes は、 X の投稿内容だけを表示できるようにする Firefox 専用の拡張機能です。

![](screenshot.png)

個別ツイート (`https://x.com/{user}/status/{id}`) を開いた際に、X のページを読み込まず、拡張機能が提供するビューアページにリダイレクトし、ツイートの内容のみを表示します。

閉じるボタンを使って閉じた際には、騒がしい SNS から離れたことを褒める、短いメッセージが表示されます。

## 開発

### セットアップ

```bash
npm install
# twemoji のダウンロード
npm run setup:twemoji
```

### コマンド

```bash
# 開発（Vite watch モード）
npm run dev

# Firefox で動作確認（Vite watch + web-ext run 並行実行）
npm run dev:firefox

# 本番ビルド
npm run build

# 拡張機能パッケージ作成（dist → web-ext-artifacts/*.zip）
npm run build:firefox

# TypeScript 型チェック + web-ext lint
npm run lint
```

## ライセンス

MIT
