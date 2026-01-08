# まにまにパパの情報発信サイト - note記事ポートフォリオ

子育て中のパパが運営する、note記事を中心としたポートフォリオサイトです。情報提供をメインとしつつ、楽天ROOMとメルカリへの自然な導線を設けています。

## ✨ 主な機能

- **note記事表示**: 自分が執筆したnote記事を見やすくカード形式で表示
- **参考記事リンク集**: 参考にしたnote記事を自分のコメント付きで紹介
- **楽天ROOM導線**: アフィリエイトリンクを含む楽天ROOMへの誘導バナー
- **メルカリ出品商品**: 手動管理による出品中のおもちゃ情報表示
- **レスポンシブデザイン**: スマホファーストで各デバイスに最適化
- **法的配慮**: プライバシーポリシー・アフィリエイト表記を明記

## 📂 ディレクトリ構造

```
/toy-cycle-strategy
├── public/                      # 公開ディレクトリ
│   ├── index.html               # トップページ
│   ├── css/
│   │   └── style.css            # メインスタイルシート
│   ├── js/
│   │   └── main.js              # メインJavaScript
│   ├── images/
│   │   └── mercari/             # メルカリ商品画像（自分で撮影したもの）
│   └── admin/
│       └── mercari-form.html    # メルカリ商品登録フォーム
├── data/
│   ├── my-articles.json         # 自分のnote記事データ
│   ├── reference-articles.json  # 参考記事データ
│   └── mercari-items.json       # メルカリ商品データ
├── server.js                    # Expressサーバー本体
├── package.json                 # 依存パッケージ定義
└── README.md                    # このファイル
```

## 🚀 セットアップと実行方法

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. サーバーの起動

```bash
npm start
```

サーバーが起動すると、コンソールに以下のように表示されます。

```
🚀 トイ・サイクル戦略室 サーバー起動
   http://localhost:3000
```

### 3. アプリケーションへのアクセス

- **サイトトップ**: `http://localhost:3000`
- **メルカリ商品登録フォーム**: `http://localhost:3000/admin/mercari-form.html`

## 📝 記事・商品の追加方法

### 自分のnote記事を追加

1. `data/my-articles.json` を開く
2. `articles` 配列に新しい記事を追加：

```json
{
  "id": 2,
  "title": "記事のタイトル",
  "url": "https://note.com/manimani_510/n/...",
  "thumbnail": "",
  "date": "2026-01-09",
  "views": 0,
  "category": "子育て",
  "description": "記事の簡単な説明"
}
```

### 参考記事を追加

1. `data/reference-articles.json` を開く
2. `articles` 配列に新しい記事を追加：

```json
{
  "id": 2,
  "title": "参考記事のタイトル",
  "author": "noteユーザー名",
  "authorUrl": "https://note.com/username",
  "articleUrl": "https://note.com/username/n/...",
  "myComment": "この記事のおかげで○○が解決できました。",
  "addedDate": "2026-01-09",
  "category": "子育て"
}
```

### メルカリ商品を追加

#### 方法1: フォームを使用（推奨）

1. `http://localhost:3000/admin/mercari-form.html` にアクセス
2. 商品情報を入力（商品を自分で撮影した写真を使用してください）
3. 「JSONコード生成」ボタンをクリック
4. 生成されたJSONをコピー
5. `data/mercari-items.json` を開き、`items` 配列に貼り付け

#### 方法2: 直接編集

1. 商品を撮影
2. 画像を `public/images/mercari/` に保存（例: item001.jpg）
3. `data/mercari-items.json` を開く
4. `items` 配列に新しい商品を追加：

```json
{
  "id": "002",
  "name": "商品名",
  "price": 1500,
  "image": "images/mercari/item002.jpg",
  "description": "商品の説明",
  "url": "https://jp.mercari.com/item/m...",
  "status": "active",
  "category": "おもちゃ",
  "addedDate": "2026-01-09",
  "soldDate": null
}
```

### 商品が売れた時の処理

`data/mercari-items.json` で該当商品の `status` を変更：

```json
"status": "sold"
```

または、配列から削除してもOKです。

## 🛠️ カスタマイズ方法

### サイト名の変更

`public/index.html` の以下の部分を編集：

```html
<h1 class="site-title">まにまにパパの情報発信サイト</h1>
<title>まにまにパパの情報発信サイト</title>
```

### 楽天ROOMのURLを変更

`public/index.html` の以下の部分を編集：

```html
<a href="https://room.rakuten.co.jp/your-room-id" ...>
```

### 色の変更

`public/css/style.css` の `:root` セクションで色を変更できます：

```css
:root {
  --main-color: #4A90E2;      /* メインカラー */
  --accent-color: #FF6B6B;    /* アクセントカラー */
  --rakuten-color: #BF0000;   /* 楽天ROOMカラー */
}
```

## ⚠️ 重要な注意事項

### 法的配慮

1. **画像使用ルール**
   - メルカリ商品：必ず自分で撮影した写真のみ使用
   - スクリーンショットは使用禁止
   - 他人が撮影した画像は無断使用禁止

2. **著作権配慮**
   - 他人のnote記事：タイトル+リンク+自分のコメントのみ
   - 全文転載は禁止

3. **アフィリエイト表記**
   - 楽天ROOMリンクには「アフィリエイトリンクを含む」旨を明記済み

4. **プライバシー**
   - 子どもの写真は使用しない
   - 個人情報は最小限に

## 🛠️ 技術スタック

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **バックエンド**: Node.js, Express
- **データストア**: JSONファイル
- **デプロイ**: 静的サイトホスティング（Vercel, Netlify等）対応

## 📱 レスポンシブ対応

- デスクトップ: 3カラムグリッド
- タブレット: 2カラムグリッド
- スマートフォン: 1カラムグリッド

## 🚀 デプロイ方法

### Vercelにデプロイ

1. GitHubにプッシュ
2. Vercelにログイン
3. プロジェクトをインポート
4. ビルド設定を以下のように設定：
   - Build Command: `npm run build`（不要な場合は空欄）
   - Output Directory: `public`

## 📞 お問い合わせ

ご質問やご要望は、noteのコメントまたはXのDMにてお願いします。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

© 2026 まにまにパパ All Rights Reserved.
