# 都道府県マスター セットアップガイド

このガイドでは、PrimeMiistersアプリを都道府県学習アプリに変換する詳細な手順を説明します。

---

## 📋 前提条件

- PrimeMiistersアプリが正常に動作している
- Node.jsとnpmがインストールされている
- 基本的なターミナル操作ができる

---

## 🚀 セットアップ手順

### ステップ1: 新しいプロジェクトディレクトリを作成

```bash
# PrimeMiistersの親ディレクトリに移動
cd /Users/kawakamitomohiro/Desktop/App

# 新しいディレクトリを作成
mkdir Prefecture-Master
cd Prefecture-Master
```

### ステップ2: PrimeMiistersの内容をコピー

```bash
# すべてのファイルをコピー（.gitとnode_modulesを除く）
cp -r ../PrimeMiisters/* .
cp -r ../PrimeMiisters/.gitignore .

# 不要なファイルを削除
rm -rf .git
rm -rf node_modules
rm -rf prefecture-template
```

### ステップ3: データファイルを置き換え

```bash
# データディレクトリのファイルを削除
rm src/data/primeministers.json
rm src/data/allprimeministers.json  
rm src/data/glossary.json

# 新しいデータをコピー
cp ../PrimeMiisters/prefecture-template/data/prefectures.json src/data/
cp ../PrimeMiisters/prefecture-template/data/allprefectures.json src/data/
cp ../PrimeMiisters/prefecture-template/data/geography-terms.json src/data/
```

---

## 📝 ファイルの編集

### 1. package.jsonを更新

```json
{
  "name": "prefecture-master",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "中学受験生向け都道府県学習アプリ",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.3"
  }
}
```

### 2. index.htmlを更新

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- タイトルと説明を変更 -->
    <title>都道府県マスター | 中学受験生向け都道府県学習アプリ</title>
    <meta name="description" content="中学受験生向け都道府県学習アプリ。47都道府県を楽しく学べます。" />
    
    <!-- PWA設定 -->
    <meta name="theme-color" content="#10b981" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="都道府県マスター" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 3. public/manifest.jsonを更新

```json
{
  "name": "都道府県マスター",
  "short_name": "都道府県マスター",
  "description": "中学受験生向け都道府県学習アプリ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "/vite.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

### 4. README.mdを更新

```markdown
# 都道府県マスター

中学受験生向けの都道府県学習アプリです。

## 機能

- 📚 学習モード: カード形式で都道府県を学習
- 🎯 クイズモード: 県庁所在地当て、特産物当て、地方区分当て
- 📊 一覧モード: 全都道府県を地方別に表示
- 📖 用語集: 地理用語を学習
- 💾 進捗管理: 学習済み都道府県を記録
- 📱 PWA対応: オフラインでも使用可能

## セットアップ

\`\`\`bash
npm install
npm run dev
\`\`\`

## ビルド

\`\`\`bash
npm run build
\`\`\`

## デプロイ

Vercelでのデプロイを推奨します。
\`\`\`
```

---

## 🎨 コードの変更

### 1. src/App.jsxの更新

変更が必要な箇所：

```javascript
// データのインポートを変更
import prefecturesData from './data/prefectures.json';
import allPrefecturesData from './data/allprefectures.json';
import geographyTerms from './data/geography-terms.json';

// コンポーネントのprops名を変更
// primeMinistersData → prefecturesData
// allPrimeMinistersData → allPrefecturesData
// glossary → geographyTerms
```

### 2. コンポーネント名の変更（推奨）

以下のファイルをリネーム：

```bash
# オプション: よりわかりやすい名前に変更
mv src/components/PrimeMinisterCard.jsx src/components/PrefectureCard.jsx
mv src/components/DailyPM.jsx src/components/DailyPrefecture.jsx
```

### 3. 表示テキストの変更

各コンポーネントで以下の用語を置換：

```
首相 → 都道府県
Prime Minister → Prefecture
功績 → 特産物
在任 → 人口/面積
歴代首相 → 都道府県
```

### 4. クイズ内容の調整

**重要：** `'name'`、`'achievement'`などのタイプ識別子は変更しないでください。
これらはプログラムで使用されているIDです。

変更すべきは**クイズの問題文と選択肢の生成ロジック**です。

`src/utils/quizUtils.js`で以下のように変更：

```javascript
// 名前当てクイズ → 県庁所在地当てクイズに変更
export const generateNameQuiz = (prefecturesData, count = 10) => {
  // ...
  return selected.map(pref => {
    // 特産物から選択肢を生成
    const specialty = pref.specialties[Math.floor(Math.random() * pref.specialties.length)];
    
    return {
      type: 'name', // ← これは変更しない（ID）
      question: `「${specialty}」が特産物なのはどこでしょう？`, // ← 問題文を変更
      options,
      correctAnswer: pref.name,
      prefecture: pref,
      hint: `${pref.region}地方`
    };
  });
};

// 功績当てクイズ → 県庁所在地当てクイズに変更
export const generateAchievementQuiz = (prefecturesData, count = 10) => {
  // ...
  return selected.map(pref => {
    return {
      type: 'achievement', // ← これは変更しない（ID）
      question: `${pref.name}の県庁所在地はどこでしょう？`, // ← 問題文を変更
      options, // 県庁所在地の選択肢
      correctAnswer: pref.capital, // ← 正解を県庁所在地に
      prefecture: pref
    };
  });
};
```

**QuizMode.jsxの表示テキストも変更:**

```javascript
// クイズタイプのラベル表示
{[
  { id: 'name', label: '都道府県当て', desc: '特産物から都道府県を選択' },
  { id: 'achievement', label: '県庁所在地当て', desc: '都道府県から県庁所在地を選択' },
  { id: 'order', label: '順序当て', desc: '人口順に並び替え' },
  { id: 'mixed', label: 'ミックス', desc: '全タイプから出題' }
].map(type => (
  // ...
))}
```

---

## 🎨 デザインのカスタマイズ

### カラースキームの変更

`tailwind.config.js`または`src/index.css`で：

```css
/* メインカラーを緑系に */
.bg-blue-600 → .bg-green-600
.text-blue-600 → .text-green-600
.border-blue-600 → .border-green-600

/* または tailwind.config.js で */
theme: {
  extend: {
    colors: {
      primary: '#10b981',  // 緑
      secondary: '#059669',
    }
  }
}
```

---

## 🔧 依存関係のインストール

```bash
npm install
```

---

## 🚀 開発サーバーの起動

```bash
npm run dev
```

http://localhost:5173 でアクセス

---

## ✅ 動作確認

### 確認項目

- [ ] タイトルが「都道府県マスター」になっている
- [ ] 学習モードで都道府県が表示される
- [ ] クイズモードが動作する
  - [ ] 県庁所在地当て
  - [ ] 特産物当て
  - [ ] 地方区分当て
  - [ ] 人口順並べ替え
- [ ] 一覧モードで47都道府県が表示される
- [ ] 用語集で地理用語が表示される
- [ ] 進捗が保存される
- [ ] PWAとしてインストールできる

---

## 📦 ビルドとデプロイ

### ビルド

```bash
npm run build
```

`dist/` フォルダに出力されます。

### Vercelでデプロイ

1. GitHubに新しいリポジトリを作成

```bash
git init
git add .
git commit -m "Initial commit: Prefecture Master"
git branch -M main
git remote add origin https://github.com/yourusername/prefecture-master.git
git push -u origin main
```

2. Vercelにログイン
   - https://vercel.com

3. 「New Project」をクリック

4. GitHubリポジトリを選択

5. プロジェクト名を入力: `prefecture-master`

6. 「Deploy」をクリック

7. 完了！URLが発行されます

---

## 🎯 カスタマイズのヒント

### クイズ内容の変更

`src/utils/quizUtils.js`を編集：

```javascript
// 県庁所在地当てクイズ
export const generateCapitalQuiz = (prefecturesData, count = 10) => {
  const selected = getRandomItems(prefecturesData, count);
  
  return selected.map(pref => {
    const wrongOptions = getRandomItems(
      prefecturesData.filter(p => p.id !== pref.id),
      3
    );
    
    const options = [...wrongOptions.map(p => p.capital), pref.capital]
      .sort(() => Math.random() - 0.5);
    
    return {
      type: 'capital',
      question: `${pref.name}の県庁所在地はどこでしょう？`,
      options,
      correctAnswer: pref.capital,
      prefecture: pref,
      hint: `${pref.region}地方`
    };
  });
};
```

### 絵文字の変更

各都道府県のデータで`imageEmoji`を編集：

```json
{
  "name": "東京都",
  "imageEmoji": "🗼"
}
```

### 地方区分の追加

データに`region`フィールドが含まれているため、
地方別フィルターを簡単に実装できます。

---

## 🐛 トラブルシューティング

### データが表示されない

```bash
# データファイルのパスを確認
ls src/data/
# prefectures.json, allprefectures.json, geography-terms.json があるか確認
```

### ビルドエラー

```bash
# キャッシュをクリア
rm -rf node_modules
rm package-lock.json
npm install
```

### PWAが動作しない

```bash
# Service Workerを確認
# ブラウザのDevTools → Application → Service Workers
```

---

## 📚 次のステップ

1. **データの充実**
   - より詳しい都道府県情報を追加
   - 地理用語を増やす

2. **機能の追加**
   - 地図表示機能
   - 音声読み上げ
   - 達成バッジシステム

3. **デザインの改善**
   - オリジナルアイコンの作成
   - カラースキームの最適化

4. **多言語対応**
   - 英語版の作成
   - 他言語対応

---

## ✨ 完成！

おめでとうございます！
都道府県学習アプリが完成しました。

同じ方法で、他のテーマのアプリも作成できます：
- 戦国武将マスター
- 世界の国マスター
- 元素記号マスター
- etc...

---

## 🤝 サポート

質問や問題があれば、GitHubのIssuesで報告してください。

Happy Learning! 🎉
