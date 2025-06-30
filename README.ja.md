# Web Synth

React、TypeScript、Tone.jsで構築されたクリーンなポリフォニックWebシンセサイザー。

## 機能

- **ポリフォニック合成**とリアルタイム波形表示
- **4オクターブ対応バーチャルピアノ**（C2-C6）キーボードマッピング対応
- **オシレーター波形**: サイン波、矩形波、ノコギリ波、三角波
- **ADSRエンベロープ**コントロール
- **フィルター**（周波数調整対応）
- **エフェクト**: コーラス、ディレイ、リバーブ
- **ミニマルインターフェース**（フローティングオクターブコントロール付き）

## クイックスタート

```bash
git clone https://github.com/HatakeyamaOsamu/musako.git
cd musako
npm install
npm run dev
```

**初回使用時**: オーディオを初期化するため、任意のピアノキーをクリックしてください。

## キーボードマッピング

```
黒鍵:  S D   G H J   2 3   5 6 7
白鍵: Z X C V B N M Q W E R T Y U I
```

オクターブコントロール: 右下角の小さな`[-] [+]`パネル

## ブラウザ要件

- Web Audio API対応のモダンブラウザ
- HTTPS接続（オーディオに必要）
- Chrome、Firefox、Safariでテスト済み

## プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
├── hooks/              # オーディオ合成フック
├── constants/          # 設定
├── utils/             # ユーティリティ
└── styles/            # CSSスタイル
```

## 開発

```bash
npm run dev          # 開発サーバー
npm run build        # プロダクションビルド
npm run type-check   # TypeScriptチェック
```

## ライセンス

MIT License

---

♪ [HatakeyamaOsamu](https://github.com/HatakeyamaOsamu)により作成