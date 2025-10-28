import { Star } from 'lucide-react';

const MaterialsPage = () => {
  const materials = [
    {
      category: "まんが教材",
      description: "歴史の流れを楽しく理解",
      icon: "📚",
      items: [
        {
          title: "角川まんが学習シリーズ 日本の歴史 全15巻",
          price: "14,980円",
          rating: 5.0,
          reviews: 1250,
          image: "📚",
          url: "https://amzn.to/3WZGZAB",
          features: [
            "全15巻で歴史全体を網羅",
            "イラストがわかりやすい",
            "受験生の85%が使用"
          ],
          recommended: [
            "歴史が苦手な人",
            "楽しく学びたい人",
            "小4-小6"
          ]
        },
        {
          title: "小学館版 学習まんが 日本の歴史 全20巻",
          price: "19,360円",
          rating: 4.8,
          reviews: 890,
          image: "📚",
          url: "https://amzn.to/48Rp06H",
          features: [
            "詳しい解説付き",
            "写真資料が豊富",
            "最新の研究成果を反映"
          ],
          recommended: [
            "詳しく学びたい人",
            "小5-小6",
            "歴史が好きな人"
          ]
        }
      ]
    },
    {
      category: "参考書",
      description: "体系的に知識を整理",
      icon: "📖",
      items: [
        {
          title: "社会コアプラス（サピックスメソッド）",
          price: "1,572円",
          rating: 4.9,
          reviews: 750,
          image: "📖",
          url: "https://amzn.to/4nsYMLt",
          features: [
            "重要事項を厳選",
            "コンパクトで持ち運びやすい",
            "SAPIX監修"
          ],
          recommended: [
            "効率的に覚えたい人",
            "塾に通っている人",
            "小5-小6"
          ]
        },
        {
          title: "中学入試 くらべてわかる できる子図鑑 社会",
          price: "1,430円",
          rating: 4.7,
          reviews: 420,
          image: "📖",
          url: "https://amzn.to/3JgDiU5",
          features: [
            "ビジュアルで理解しやすい",
            "比較して覚えられる",
            "重要ポイントがわかる"
          ],
          recommended: [
            "視覚的に学びたい人",
            "暗記が苦手な人",
            "小4-小6"
          ]
        }
      ]
    },
    {
      category: "問題集",
      description: "実践力を身につける",
      icon: "📝",
      items: [
        {
          title: "中学入試 でる順過去問 社会 合格への1008問",
          price: "1,320円",
          rating: 4.2,
          reviews: 114,
          image: "📝",
          url: "https://amzn.to/4oKevXG",
          features: [
            "頻出問題を厳選",
            "解説が詳しい",
            "段階的に難易度アップ"
          ],
          recommended: [
            "問題演習をしたい人",
            "受験直前",
            "小6"
          ]
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          🎓 中学受験 歴史学習おすすめ教材
        </h1>
        <p className="text-gray-600">
          実際に使って効果のあった教材を厳選してご紹介
        </p>
      </div>

      {/* 目次 */}
      <div className="mb-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="font-bold text-lg mb-4">📋 目次</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {materials.map((cat, idx) => (
            <a
              key={idx}
              href={`#${cat.category}`}
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{cat.category}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 各カテゴリ */}
      {materials.map((category, catIdx) => (
        <section key={catIdx} id={category.category} className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-3xl">{category.icon}</span>
              {category.category}
            </h2>
            <p className="text-gray-600">{category.description}</p>
          </div>

          <div className="space-y-6">
            {category.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="md:flex gap-6">
                  {/* 商品画像エリア */}
                  <div className="md:w-48 mb-4 md:mb-0">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-6xl">
                      {item.image}
                    </div>
                  </div>

                  {/* 商品情報 */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>

                    {/* 評価 */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < Math.floor(item.rating) ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.rating} ({item.reviews}件のレビュー)
                      </span>
                    </div>

                    {/* 価格 */}
                    <div className="text-2xl font-bold text-red-600 mb-4">
                      {item.price}
                    </div>

                    {/* 特徴 */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        ✨ 特徴
                      </h4>
                      <ul className="space-y-1">
                        {item.features.map((feature, fIdx) => (
                          <li key={fIdx} className="text-sm text-gray-700">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* おすすめな人 */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        👍 こんな人におすすめ
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.recommended.map((rec, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 購入ボタン */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-8 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                      Amazonで詳細を見る →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* フッター */}
      <div className="mt-12 p-6 bg-gray-100 rounded-lg text-center">
        <p className="text-sm text-gray-600">
          ※価格は変動する場合があります<br />
          ※Amazonアソシエイトリンクです。購入により当サイトに収益が入ります
        </p>
      </div>
    </div>
  );
};

export default MaterialsPage;
