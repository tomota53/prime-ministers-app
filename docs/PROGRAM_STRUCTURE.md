# プログラム構成図 - React初心者向け

このアプリの構造を詳しく解説します。

---

## 🌐 URLアクセスから画面表示までの流れ

```
ユーザーがURLにアクセス
         ↓
┌────────────────────────────────┐
│ 1. index.html が読み込まれる    │
│    (エントリーポイント)          │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ 2. main.jsx が実行される        │
│    (Reactアプリの起動)          │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ 3. App.jsx が実行される         │
│    (メインコンポーネント)        │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ 4. Header + 各モードが表示      │
│    (ユーザーに画面表示)         │
└────────────────────────────────┘
```

---

## 📁 ファイル構成と役割

```
PrimeMiisters/
│
├── index.html .................... 【最初に読み込まれるHTML】
│   └─ <div id="root"></div> ..... Reactアプリがここに表示される
│   └─ <script src="main.jsx"> ... main.jsxを呼び出す
│
├── src/
│   │
│   ├── main.jsx .................. 【Reactアプリの起動ファイル】
│   │   └─ App.jsx を呼び出す
│   │
│   ├── App.jsx ................... 【メインコンポーネント】★重要★
│   │   ├─ Header ................ ヘッダー（モード切替）
│   │   ├─ StudyModeWithTabs ..... 学習モード
│   │   ├─ QuizMode .............. クイズモード
│   │   ├─ ListView .............. 一覧モード
│   │   └─ GlossaryView .......... 用語集モード
│   │
│   ├── components/ ............... 【各画面パーツ】
│   │   ├── Header.jsx ........... タイトルとモード切替ボタン
│   │   ├── DailyPM.jsx .......... 今日の首相
│   │   ├── LearnMode.jsx ........ カード学習
│   │   ├── QuizMode.jsx ......... クイズ
│   │   ├── ListView.jsx ......... 一覧表示
│   │   ├── GlossaryView.jsx ..... 用語集
│   │   ├── FilterBar.jsx ........ フィルターボタン
│   │   └── PrimeMinisterCard.jsx. 首相カード
│   │
│   ├── data/ ..................... 【データファイル】
│   │   ├── primeministers.json .. 重要7首相データ
│   │   ├── allprimeministers.json 主要33首相データ
│   │   └── glossary.json ........ 用語集データ
│   │
│   ├── hooks/ .................... 【カスタムフック】
│   │   └── useLocalStorage.js ... データ保存・読込
│   │
│   ├── utils/ .................... 【便利な関数】
│   │   └── quizUtils.js ......... クイズ生成ロジック
│   │
│   └── index.css ................. 【スタイル】
│       └─ Tailwind CSS設定
│
└── public/ ....................... 【静的ファイル】
    ├── manifest.json ............. PWA設定
    └── sw.js ..................... Service Worker（オフライン対応）
```

---

## 🎯 詳細な動作フロー

### 1. 起動シーケンス

```
【ステップ1】ブラウザでURLにアクセス
  ↓
【ステップ2】index.htmlが読み込まれる
  ↓
  HTML内容:
  <div id="root"></div>  ← ここにReactが表示される
  <script src="/src/main.jsx"></script>
  ↓
【ステップ3】main.jsxが実行される
  ↓
  コード:
  import App from './App.jsx'
  ReactDOM.createRoot(document.getElementById('root'))
    .render(<App />)
  
  意味: App.jsxを<div id="root">に表示
  ↓
【ステップ4】App.jsxが実行される
  ↓
  State（状態）の初期化:
  - currentMode = 'study' (最初は学習モード)
  - learnedIds = [] (学習済みIDの配列)
  
  コンポーネントの表示:
  - Header
  - 学習モード（StudyModeWithTabs）
  ↓
【ステップ5】画面が表示される
```

---

## 🧩 コンポーネントの階層構造

```
App.jsx (親)
  │
  ├─ Header (子)
  │   └─ モード切替ボタン × 4
  │
  └─ メインコンテンツ (currentModeで切り替わる)
      │
      ├─ StudyModeWithTabs (currentMode === 'study')
      │   ├─ DailyPM
      │   │   └─ 今日の首相情報
      │   └─ LearnMode
      │       └─ カード学習
      │
      ├─ QuizMode (currentMode === 'quiz')
      │   └─ クイズ問題と解答
      │
      ├─ ListView (currentMode === 'list')
      │   ├─ FilterBar
      │   └─ PrimeMinisterCard × 複数
      │
      └─ GlossaryView (currentMode === 'glossary')
          └─ 用語一覧
```

---

## 🔄 データの流れ

### 例: ユーザーが「クイズ」ボタンをクリックした時

```
【1】ユーザーがクリック
     Header.jsx の「クイズ」ボタン
        ↓
【2】onClick イベント発火
     onModeChange('quiz') が実行される
        ↓
【3】App.jsx の setCurrentMode が呼ばれる
     currentMode が 'study' → 'quiz' に変更
        ↓
【4】React が再レンダリング
     App.jsx が再実行される
        ↓
【5】条件分岐
     {currentMode === 'quiz' && <QuizMode />}
     が true になる
        ↓
【6】QuizMode.jsx が表示される
     クイズ画面に切り替わる
```

---

## 📊 State（状態）管理の仕組み

### App.jsx の State

```javascript
// 現在のモード（学習/クイズ/一覧/用語集）
const [currentMode, setCurrentMode] = useState('study');

// 学習済みID（ローカルストレージから読込）
const [learnedIds] = useLocalStorage('learnedPrimeMinisterIds', []);
```

### State とは？
- アプリの「記憶」のようなもの
- State が変わると、自動的に画面が更新される
- 例: currentMode が変わると、表示するモードが切り替わる

---

## 🗂️ データの読み込み

### JSONデータの使い方

```javascript
// App.jsx
import primeMinistersData from './data/primeministers.json';
import allPrimeMinistersData from './data/allprimeministers.json';

// これで以下のようなデータが使える:
[
  {
    id: 1,
    name: "伊藤博文",
    kana: "いとうひろぶみ",
    achievements: [...],
    ...
  },
  ...
]

// コンポーネントに渡す
<LearnMode primeMinistersData={primeMinistersData} />
```

---

## 🎨 スタイリング（Tailwind CSS）

### Tailwind CSS の仕組み

```jsx
// コンポーネント内
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
  クリック
</button>

// これが以下のCSSに変換される:
.bg-blue-600 { background-color: #2563eb; }
.text-white { color: #ffffff; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.rounded-lg { border-radius: 0.5rem; }
```

---

## 💾 ローカルストレージ（データ保存）

### useLocalStorage フック

```javascript
// hooks/useLocalStorage.js
const [value, setValue] = useLocalStorage('key', defaultValue);

// 使用例:
const [learnedIds, setLearnedIds] = useLocalStorage('learnedPrimeMinisterIds', []);

// 内部動作:
setValue([1, 2, 3]) 
  ↓
localStorage.setItem('learnedPrimeMinisterIds', '[1,2,3]')
  ↓
ブラウザに保存される
  ↓
次回アクセス時に自動読込
```

---

## 🔍 具体例: 学習モードの動作

### ユーザーが「覚えた！」ボタンを押した時

```
【1】ユーザーがボタンクリック
     LearnMode.jsx の「覚えた！」ボタン
        ↓
【2】markAsLearned() 関数が実行
     const markAsLearned = () => {
       setLearnedIds([...learnedIds, currentCard.id]);
       goToNext();
     }
        ↓
【3】learnedIds が更新される
     例: [] → [1]
        ↓
【4】useLocalStorage が発動
     localStorage に保存
        ↓
【5】次のカードへ移動
     goToNext() が実行される
        ↓
【6】画面が更新される
     新しいカードが表示
```

---

## 🛠️ 開発の流れ

### 1. 開発サーバー起動

```bash
npm run dev
```

↓

```
Vite が起動
  ↓
ファイル監視開始
  ↓
http://localhost:5173 でアクセス可能
  ↓
ファイルを編集
  ↓
自動的にブラウザが更新（ホットリロード）
```

### 2. ビルド（本番用）

```bash
npm run build
```

↓

```
Vite がビルド実行
  ↓
最適化・圧縮
  ↓
dist/ フォルダに出力
  ↓
これをVercelにデプロイ
```

---

## 📦 依存関係（使用しているライブラリ）

```
React
  └─ UI構築の基盤

React DOM
  └─ ReactをブラウザのDOMに表示

Vite
  └─ 開発サーバー＆ビルドツール

Tailwind CSS
  └─ スタイリング

lucide-react
  └─ アイコン
```

---

## 🎯 重要なReact概念

### 1. コンポーネント
```
再利用可能なUI部品
例: Header, LearnMode, QuizMode

<Header />  ← これがコンポーネント
```

### 2. Props（プロパティ）
```
親から子へデータを渡す

親: <LearnMode primeMinistersData={data} />
子: function LearnMode({ primeMinistersData }) { ... }
```

### 3. State（状態）
```
コンポーネント内の変数（変更可能）

const [count, setCount] = useState(0);
setCount(count + 1);  ← 更新すると再レンダリング
```

### 4. Hooks
```
React機能を使うための関数

useState() ......... State管理
useEffect() ........ 副作用処理
useLocalStorage() .. カスタムフック
```

---

## 🔄 レンダリングのタイミング

### いつ画面が更新されるか？

```
1. State が変わった時
   setCurrentMode('quiz')
   ↓
   再レンダリング

2. Props が変わった時
   親から渡されるデータが変わった
   ↓
   再レンダリング

3. 親が再レンダリングされた時
   親コンポーネントが更新
   ↓
   子も再レンダリング
```

---

## 💡 学習のポイント

### 初心者が理解すべきポイント（優先順）

#### 1. コンポーネントの概念 ★★★★★
```
UIを小さな部品に分ける
→ 再利用しやすい
→ 管理しやすい
```

#### 2. Props でデータを渡す ★★★★★
```
親 → 子 にデータを渡す
<Child data={myData} />
```

#### 3. State で状態管理 ★★★★★
```
useState() を使う
変更すると自動で画面更新
```

#### 4. イベント処理 ★★★★☆
```
onClick={handleClick}
ユーザーの操作に反応
```

#### 5. 条件付きレンダリング ★★★★☆
```
{condition && <Component />}
条件に応じて表示/非表示
```

---

## 📚 次に学ぶと良いこと

### 1. useEffect フック
```javascript
// 画面表示時に1回だけ実行
useEffect(() => {
  console.log('マウント時');
}, []);

// State変更時に実行
useEffect(() => {
  console.log('countが変わった');
}, [count]);
```

### 2. React Router
```
複数ページのアプリを作る
/home, /about などのURL
```

### 3. Context API
```
深い階層にデータを渡す
（Propsのバケツリレー回避）
```

### 4. カスタムフック
```
ロジックの再利用
useLocalStorage のように
```

---

## 🎓 このアプリで使われている技術まとめ

### React基礎
- ✅ コンポーネント分割
- ✅ Props でデータ受け渡し
- ✅ useState で状態管理
- ✅ 条件付きレンダリング
- ✅ リスト表示（map）
- ✅ イベント処理

### React応用
- ✅ カスタムフック（useLocalStorage）
- ✅ useEffect（副作用処理）
- ✅ useMemo（計算結果のキャッシュ）

### その他
- ✅ JSON データの読込
- ✅ Tailwind CSS
- ✅ PWA（オフライン対応）
- ✅ ローカルストレージ

---

## 🚀 まとめ

### アプリの動作フロー

```
1. index.html 読込
   ↓
2. main.jsx 実行（Reactアプリ起動）
   ↓
3. App.jsx 実行（メインコンポーネント）
   ↓
4. Header + 各モード表示
   ↓
5. ユーザー操作
   ↓
6. State更新
   ↓
7. 自動で再レンダリング
   ↓
8. 画面更新
```

### 学習の順序

```
1. まずコンポーネントを理解
2. Props の使い方を覚える
3. useState で状態管理
4. イベント処理を試す
5. 実際に作ってみる！
```

**実際に動かしながら学ぶのが一番！** 🎉
