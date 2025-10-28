# 都道府県マスター (Prefecture-Master)

PrimeMiistersアプリをベースにした都道府県学習アプリのテンプレートです。

## 📦 このテンプレートについて

このディレクトリには、都道府県学習アプリに必要なデータと設定ファイルが含まれています。

## 🚀 新しいプロジェクトとして使用する方法

### ステップ1: 新しいディレクトリを作成

```bash
# PrimeMiistersの親ディレクトリに移動
cd ..

# 新しいプロジェクトを作成
mkdir Prefecture-Master
cd Prefecture-Master

# PrimeMiistersの内容をコピー（.gitを除く）
cp -r ../PrimeMiisters/* .
rm -rf .git
rm -rf node_modules

# prefecture-templateの内容で上書き
cp -r prefecture-template/data/* src/data/
```

### ステップ2: package.jsonを更新

```json
{
  "name": "prefecture-master",
  "version": "1.0.0",
  "description": "中学受験生向け都道府県学習アプリ",
  ...
}
```

### ステップ3: タイトルとメタデータを更新

#### index.html
```html
<title>都道府県マスター | 中学受験生向け都道府県学習アプリ</title>
<meta name="description" content="中学受験生向け都道府県学習アプリ" />
```

#### public/manifest.json
```json
{
  "name": "都道府県マスター",
  "short_name": "都道府県マスター",
  ...
}
```

### ステップ4: 依存関係をインストール

```bash
npm install
```

### ステップ5: 開発サーバーを起動

```bash
npm run dev
```

## 📊 データ構造

### prefectures.json (重要10都道府県)

中学受験で特に重要な都道府県のデータです。

### allprefectures.json (全47都道府県)

全都道府県のデータです。

### geography-terms.json (地理用語)

地理学習に必要な用語集です。

## 🎨 カスタマイズポイント

### 1. カラースキーム

`src/index.css`のカラー設定を変更：
- メインカラー: 青 → 緑系
- アクセントカラー: 赤 → オレンジ系

### 2. コンポーネント名の変更

以下のファイルで変数名・コンポーネント名を変更：
- `PrimeMinisterCard.jsx` → `PrefectureCard.jsx`
- `primeMinistersData` → `prefecturesData`

### 3. クイズタイプの調整

`src/utils/quizUtils.js`のクイズ生成ロジックを都道府県用に調整：
- 名前当て → 県庁所在地当て
- 功績当て → 特産物当て
- 順序当て → 人口順/面積順

## 📝 TODO リスト

完全な移行には以下の作業が必要です：

- [ ] データファイルの配置
- [ ] package.json の更新
- [ ] index.html のタイトル変更
- [ ] manifest.json の更新
- [ ] カラースキームの変更
- [ ] コンポーネント名の変更
- [ ] クイズロジックの調整
- [ ] 新しいGitリポジトリの作成
- [ ] Vercelでのデプロイ

## 🎯 このテンプレートの内容

```
prefecture-template/
├── README.md (このファイル)
├── data/
│   ├── prefectures.json (重要10都道府県)
│   ├── allprefectures.json (全47都道府県)
│   └── geography-terms.json (地理用語集)
└── docs/
    └── SETUP_GUIDE.md (詳細なセットアップ手順)
```

## ✨ 完成イメージ

- **タイトル**: 都道府県マスター
- **テーマカラー**: 緑系
- **学習対象**: 47都道府県
- **クイズ**: 県庁所在地、特産物、地方区分、人口順
- **用語集**: 地理用語（平野、山脈、気候など）

## 📱 展開後の機能

すべての学習機能がそのまま使えます：
- ✅ 学習モード（カード学習）
- ✅ 今日の都道府県
- ✅ クイズモード（4種類）
- ✅ 一覧モード
- ✅ 用語集
- ✅ 進捗管理
- ✅ PWA対応
