# Amazonアソシエイト 実装ガイド

商品リンクの探し方から実装まで、具体的な手順を詳しく解説します。

---

## 📋 全体の流れ

```
1. Amazonアソシエイトに登録（5分）
   ↓
2. 紹介する商品を探す（10分）
   ↓
3. アフィリエイトリンクを生成（5分）
   ↓
4. コードに実装（10分）
   ↓
5. デプロイして確認
```

**合計30分で完了！**

---

## ステップ1: Amazonアソシエイト登録

### 1-1. 登録ページにアクセス

```
https://affiliate.amazon.co.jp/
```

### 1-2. 「無料アカウントを作成する」をクリック

すでにAmazonアカウントがあれば、そのままログイン。
なければ新規作成。

### 1-3. 必要情報を入力

```
【アカウント情報】
- 氏名
- 住所
- 電話番号

【Webサイト情報】
- WebサイトのURL
  例: https://your-app.vercel.app
- Webサイトの説明
  例: 中学受験生向けの歴代首相学習アプリです

【トラフィック情報】
- 月間ユニークビジター数: 100-500 を選択
- Webサイトのトピック: 教育
```

### 1-4. 身分証明書の提出

```
- 運転免許証 or
- パスポート or
- マイナンバーカード

写真をアップロード
```

### 1-5. 銀行口座情報

```
報酬の振込先を登録
（5,000円以上で振込）
```

### 1-6. 登録完了

```
「アソシエイトID」が発行される
例: yourname-22

これを後で使います
```

---

## ステップ2: 商品を探す

### 2-1. Amazonで商品検索

```
1. Amazon.co.jp にアクセス
2. 検索ボックスに入力
```

### 検索キーワード例

```
中学受験向け:
- "中学受験 歴史"
- "歴史まんが 日本の歴史"
- "中学入試 社会 問題集"
- "学習まんが 歴史"
- "中学受験 年表"
```

### 2-2. おすすめ商品リスト

```
【歴史マンガ】
1. 角川まんが学習シリーズ 日本の歴史 全15巻
   約13,000円
   → 紹介料: 約390円（3%）

2. 小学館版 学習まんが 日本の歴史 全20巻
   約19,000円
   → 紹介料: 約570円（3%）

【参考書】
3. サピックス 社会 コアプラス
   約1,650円
   → 紹介料: 約50円（3%）

4. 中学入試 でる順過去問 社会 合格への1008問
   約1,320円
   → 紹介料: 約40円（3%）

【年表・カード】
5. 中学入試 くらべてわかる できる子図鑑 社会
   約1,320円
   → 紹介料: 約40円（3%）
```

---

## ステップ3: アフィリエイトリンクを生成

### 方法A: アソシエイトツールバー（簡単）

#### 3-1. ツールバーをインストール

```
1. アソシエイト・セントラルにログイン
   https://affiliate.amazon.co.jp/

2. 上部メニュー「ツール」→「SiteStripe」

3. ブラウザのブックマークバーに
   「アソシエイトツールバー」を追加
```

#### 3-2. リンクを生成

```
1. Amazon.co.jp で商品ページを開く
   例: 角川まんが学習シリーズ 日本の歴史

2. ページ上部にツールバーが表示される

3. 「テキスト」をクリック

4. 「短縮URL」をコピー
   例: https://amzn.to/xxxxxx
```

### 方法B: アソシエイト・セントラルから（詳細設定可能）

#### 3-1. 商品リンクページ

```
1. https://affiliate.amazon.co.jp/ にログイン

2. 上部メニュー「商品リンク」→「商品リンク」

3. 検索ボックスに商品名を入力
   例: 角川まんが学習シリーズ

4. 商品を選択

5. 「リンク作成」ボタンをクリック
```

#### 3-2. リンクをコピー

```
表示されるリンク:
https://www.amazon.co.jp/dp/B00XXXXXX?tag=yourname-22

または短縮URL:
https://amzn.to/xxxxxx

どちらでもOK（短縮URLの方が見やすい）
```

---

## ステップ4: コードに実装

### 4-1. データファイルに商品情報を追加

```json
// src/data/primeministers.json に追加
{
  "id": 1,
  "name": "伊藤博文",
  "kana": "いとうひろぶみ",
  ...
  "amazonProducts": [
    {
      "title": "社会コアプラス: 中学入試小5・6年生対象 (サピックスメソッド)",
      "url": "https://amzn.to/4nsYMLt",
      "price": "1,572円"
    }
  ]
}
```

### 4-2. コンポーネントに実装

#### LearnMode.jsx に追加

```jsx
// src/components/LearnMode.jsx

{/* 既存のカード表示の後に追加 */}

{/* おすすめ参考書セクション */}
{currentCard.amazonProducts && currentCard.amazonProducts.length > 0 && (
  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
      <span className="text-2xl">📚</span>
      もっと詳しく学ぶ
    </h3>
    <div className="space-y-2">
      {currentCard.amazonProducts.map((product, index) => (
        <a
          key={index}
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {product.title}
              </p>
              {product.price && (
                <p className="text-xs text-gray-600 mt-1">
                  {product.price}
                </p>
              )}
            </div>
            <div className="ml-2 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </a>
      ))}
    </div>
    <p className="text-xs text-gray-500 mt-3">
      ※Amazonアソシエイトリンク。購入により当サイトに収益が入ります。
    </p>
  </div>
)}
```

---

## ステップ5: 全首相分のリンクを追加

### 5-1. 各首相に合わせた商品を探す

```
伊藤博文の時代:
→ 「明治時代 歴史まんが」で検索

吉田茂の時代:
→ 「戦後 昭和 歴史まんが」で検索

安倍晋三の時代:
→ 「現代史 参考書」で検索
```

### 5-2. 汎用商品を追加

```
全員に共通する商品:
- 「日本の歴史」全巻セット
- 「中学受験 社会 問題集」
- 「歴史年表暗記カード」
```

### 5-3. 効率的な実装

すべての首相に同じ商品リンクを表示する場合:

```jsx
// src/components/LearnMode.jsx

// 汎用商品リストを定義
const generalProducts = [
  {
    title: "角川まんが学習シリーズ 日本の歴史 全15巻",
    url: "https://amzn.to/xxxxx1",
    price: "13,200円"
  },
  {
    title: "中学入試 でる順過去問 社会",
    url: "https://amzn.to/xxxxx2",
    price: "1,320円"
  }
];

// 表示部分
<div className="mt-6 p-4 bg-yellow-50 rounded-lg">
  <h3 className="font-bold text-lg mb-3">📚 おすすめ参考書</h3>
  {generalProducts.map((product, index) => (
    <a
      key={index}
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 mb-2 bg-white rounded-lg hover:bg-gray-50"
    >
      <p className="font-semibold text-sm">{product.title}</p>
      <p className="text-xs text-gray-600">{product.price}</p>
    </a>
  ))}
  <p className="text-xs text-gray-500 mt-2">
    ※Amazonアソシエイトリンク
  </p>
</div>
```

---

## 📊 収益を最大化するコツ

### 1. 複数の価格帯の商品を紹介

```
【低価格】1,000-2,000円
- 問題集、参考書
- 紹介料: 30-60円
- 購入されやすい

【中価格】3,000-5,000円
- 単行本セット
- 紹介料: 90-150円

【高価格】10,000-20,000円
- まんが全巻セット
- 紹介料: 300-600円
- 購入率は低いが単価が高い
```

### 2. レビュー評価の高い商品を選ぶ

```
★4.5以上の商品を選ぶ
→ 購入率が高い
```

### 3. 季節に合わせた商品

```
2-4月: 新学期向け参考書
7-8月: 夏休み向け問題集
11-12月: 受験直前対策
```

---

## 🎯 実装の優先順位

### Phase 1: 最小限の実装（今日）

```
1. アソシエイト登録
2. 汎用商品2-3個のリンク生成
3. LearnMode.jsx に実装
4. デプロイ

所要時間: 30分
```

### Phase 2: 充実化（今週）

```
1. 各価格帯の商品を追加（計5-10商品）
2. ListView.jsx にも追加
3. QuizMode 終了後に表示

所要時間: 1時間
```

### Phase 3: 最適化（来月）

```
1. 各首相専用の商品追加
2. クリック率の分析
3. 商品の入れ替え

継続的に改善
```

---

## ⚠️ 注意事項

### 禁止事項

```
❌ 自分でクリックして購入
❌ 他人に購入を強要
❌ 虚偽の商品説明
❌ 価格の表示義務違反
```

### 推奨事項

```
✅ 実際に良いと思う商品のみ紹介
✅ 「アソシエイトリンク」と明記
✅ 定期的にリンク切れをチェック
✅ 購入者の役に立つ情報を提供
```

---

## 📈 収益シミュレーション

### 月間100人のユーザー

```
訪問者: 100人
クリック率: 5% → 5人がクリック
購入率: 20% → 1人が購入

購入商品: 13,200円のまんがセット
紹介料: 396円（3%）

月間収益: 約400円
年間収益: 約4,800円
```

### 月間1000人のユーザー

```
訪問者: 1000人
クリック率: 5% → 50人がクリック
購入率: 20% → 10人が購入

平均購入単価: 5,000円
紹介料: 150円/件

月間収益: 1,500円
年間収益: 18,000円
```

---

## ✨ まとめ

### 今日やること

1. **Amazonアソシエイト登録**（5分）
2. **商品を3つ探す**（10分）
3. **リンクを生成**（5分）
4. **コードに実装**（10分）

**合計30分で完了！**

### 実装コードのサンプル

```jsx
// 最もシンプルな実装
<div className="mt-4 p-3 bg-yellow-50 rounded-lg">
  <h4 className="font-bold mb-2">📚 おすすめ参考書</h4>
  <a
    href="https://amzn.to/xxxxx"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    角川まんが学習シリーズ 日本の歴史
  </a>
  <p className="text-xs text-gray-500 mt-1">
    ※Amazonアソシエイトリンク
  </p>
</div>
```

### 次のステップ

```
今日: 基本実装
今週: 商品を増やす
来月: 収益を分析して最適化
```

**まずは1つのリンクから始めましょう！** 🚀
