# GitHub Pages デプロイ設定

このプロジェクトをGitHub Pagesで公開するための手順です。

## 手動デプロイ

1. ローカルでビルドを実行:
```bash
npm install
npm run build
```

2. `dist`フォルダが生成されます

## 自動デプロイ（推奨）

PRがマージされた後、以下の手順でGitHub Actionsを設定してください：

### 1. GitHub Actions ワークフローを作成

`.github/workflows/deploy.yml` ファイルを作成し、以下の内容を追加：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2. GitHub Pages を有効化

1. リポジトリの Settings → Pages に移動
2. Source を「GitHub Actions」に設定
3. 保存

### 3. デプロイの確認

- ワークフローが自動実行されます
- 成功すると、`https://[username].github.io/musako/` でアクセス可能になります

## 注意事項

- `vite.config.ts` の `base` オプションが `/musako/` に設定されていることを確認してください
- GitHub Pagesは無料プランでもパブリックリポジトリで利用可能です
