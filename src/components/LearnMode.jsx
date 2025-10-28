import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Shuffle, RotateCcw } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

const LearnMode = ({ primeMinistersData }) => {
  // 学習済みの首相IDを保存
  const [learnedIds, setLearnedIds] = useLocalStorage('learnedPrimeMinisterIds', []);
  
  // 現在表示中のカードインデックス
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // カードの表示順序
  const [cardOrder, setCardOrder] = useState([]);
  
  // フィルターモード（all, high, review）
  const [filterMode, setFilterMode] = useState('all');
  
  // 表示する首相リスト
  const [displayList, setDisplayList] = useState([]);

  // 初期化：受験頻出度順にソート
  useEffect(() => {
    const frequencyOrder = { high: 1, medium: 2, low: 3 };
    const sorted = [...primeMinistersData].sort((a, b) => {
      return frequencyOrder[a.examFrequency] - frequencyOrder[b.examFrequency];
    });
    setCardOrder(sorted.map(pm => pm.id));
  }, [primeMinistersData]);

  // フィルターモードに応じて表示リストを更新
  useEffect(() => {
    let filtered = primeMinistersData;
    
    if (filterMode === 'high') {
      // 頻出のみ
      filtered = primeMinistersData.filter(pm => pm.examFrequency === 'high');
    } else if (filterMode === 'review') {
      // 復習モード：覚えていない首相のみ
      filtered = primeMinistersData.filter(pm => !learnedIds.includes(pm.id));
    }
    
    // cardOrderに従って並べ替え
    const ordered = cardOrder
      .map(id => filtered.find(pm => pm.id === id))
      .filter(Boolean);
    
    setDisplayList(ordered);
    setCurrentIndex(0);
  }, [filterMode, cardOrder, primeMinistersData, learnedIds]);

  // 現在のカード
  const currentCard = displayList[currentIndex];
  
  // 進捗率
  const progress = displayList.length > 0 
    ? ((currentIndex + 1) / displayList.length) * 100 
    : 0;

  // 次のカードへ
  const goToNext = () => {
    if (currentIndex < displayList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 前のカードへ
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 「覚えた」をマーク
  const markAsLearned = () => {
    if (currentCard && !learnedIds.includes(currentCard.id)) {
      setLearnedIds([...learnedIds, currentCard.id]);
    }
    goToNext();
  };

  // 「覚えていない」をマーク
  const markAsNotLearned = () => {
    if (currentCard && learnedIds.includes(currentCard.id)) {
      setLearnedIds(learnedIds.filter(id => id !== currentCard.id));
    }
    goToNext();
  };

  // ランダムシャッフル
  const shuffleCards = () => {
    const shuffled = [...cardOrder].sort(() => Math.random() - 0.5);
    setCardOrder(shuffled);
    setCurrentIndex(0);
  };

  // 進捗リセット
  const resetProgress = () => {
    if (window.confirm('学習進捗をリセットしますか？')) {
      setLearnedIds([]);
      setCurrentIndex(0);
    }
  };

  if (!currentCard) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          すべて完了しました！
        </h3>
        <p className="text-gray-600 mb-6">
          {filterMode === 'review' 
            ? '復習する首相がありません' 
            : 'すべての首相を学習しました'}
        </p>
        <button
          onClick={() => setFilterMode('all')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          最初から学習する
        </button>
      </div>
    );
  }

  const isLearned = learnedIds.includes(currentCard.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* コントロールバー */}
      <div className="mb-4 flex items-center justify-between gap-2">
        {/* フィルターボタン */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilterMode('high')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              filterMode === 'high'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            頻出のみ
          </button>
          <button
            onClick={() => setFilterMode('review')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              filterMode === 'review'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            復習
          </button>
        </div>

        {/* ユーティリティボタン */}
        <div className="flex gap-2">
          <button
            onClick={shuffleCards}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="シャッフル"
          >
            <Shuffle size={20} className="text-gray-700" />
          </button>
          <button
            onClick={resetProgress}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="進捗リセット"
          >
            <RotateCcw size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {currentIndex + 1} / {displayList.length}
          </span>
          <span className="text-sm text-gray-600">
            学習済み: {learnedIds.length}人
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* カード表示 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 min-h-[400px]">
        {/* 学習済みバッジ */}
        {isLearned && (
          <div className="flex items-center gap-2 mb-4 text-green-600">
            <Check size={20} />
            <span className="text-sm font-semibold">学習済み</span>
          </div>
        )}

        {/* 氏名と絵文字 */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl">{currentCard.imageEmoji}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentCard.name}
                <span className="text-sm text-gray-600 ml-2">（{currentCard.kana}）</span>
              </h2>
            </div>
          </div>
        </div>

        {/* 基本情報 */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {currentCard.order}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {currentCard.termStart}年 - {currentCard.termEnd}年
          </span>
          <span className={`px-3 py-1 rounded-full text-sm text-white ${
            currentCard.examFrequency === 'high' ? 'bg-red-500' :
            currentCard.examFrequency === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
          }`}>
            {currentCard.examFrequency === 'high' ? '最重要' :
             currentCard.examFrequency === 'medium' ? '重要' : '基本'}
          </span>
        </div>

        {/* 政党 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">政党：</span>
            {currentCard.party}
          </p>
        </div>

        {/* 主な功績 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            主な功績
          </h3>
          <ul className="space-y-2">
            {currentCard.achievements.map((achievement, index) => (
              <li key={index} className="text-gray-700 flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 関連する歴史的出来事 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            関連する歴史的出来事
          </h3>
          <p className="text-sm text-gray-700">
            {currentCard.relatedEvents}
          </p>
        </div>
         {/* おすすめ参考書 */}
<div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
    <span className="text-2xl">📚</span>
    もっと詳しく学ぶ
  </h3>
  
  <a
    href="https://amzn.to/4nsYMLt"
    target="_blank"
    rel="noopener noreferrer"
    className="block p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">
          社会コアプラス: 中学入試小5・6年生対象 (サピックスメソッド)
        </p>
        <p className="text-xs text-gray-600 mt-1">
          1,572円
        </p>
      </div>
      <div className="ml-2 text-blue-600">→</div>
    </div>
  </a>

  <p className="text-xs text-gray-500 mt-3">
    ※Amazonアソシエイトリンク。購入により当サイトに収益が入ります。
  </p>
</div>
      </div>

     


      {/* ナビゲーションボタン */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={20} />
          前へ
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === displayList.length - 1}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          次へ
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 学習ボタン */}
      <div className="flex gap-4">
        <button
          onClick={markAsNotLearned}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
        >
          <X size={24} />
          まだ覚えていない
        </button>
        <button
          onClick={markAsLearned}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md"
        >
          <Check size={24} />
          覚えた！
        </button>
      </div>
    </div>
  );
};

export default LearnMode;
