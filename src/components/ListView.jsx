import { useState, useMemo } from 'react';
import { Search, SortAsc, TrendingUp, Calendar, User, Star, Users } from 'lucide-react';
import PrimeMinisterCard from './PrimeMinisterCard';
import FilterBar from './FilterBar';
import useLocalStorage from '../hooks/useLocalStorage';
import allPrimeMinistersData from '../data/allprimeministers.json';

const ListView = ({ primeMinistersData }) => {
  // データモード選択
  const [dataMode, setDataMode] = useState('important'); // 'important' or 'all'
  
  // 検索クエリ
  const [searchQuery, setSearchQuery] = useState('');
  
  // ソート順
  const [sortBy, setSortBy] = useState('era'); // era, frequency, name
  
  // フィルター状態
  const [filters, setFilters] = useState({
    frequency: 'all',
    era: 'all'
  });

  // 学習済みIDをLocalStorageから取得
  const [learnedIds] = useLocalStorage('learnedPrimeMinisterIds', []);

  // 使用するデータを選択
  const currentData = dataMode === 'important' ? primeMinistersData : allPrimeMinistersData;

  // フィルター変更ハンドラー
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // 時代の範囲を取得
  const getEraRange = (eraId) => {
    const eras = {
      meiji: { start: 1868, end: 1912 },
      taisho: { start: 1912, end: 1926 },
      showa: { start: 1926, end: 1989 },
      heisei: { start: 1989, end: 2019 },
      reiwa: { start: 2019, end: 2100 }
    };
    return eras[eraId];
  };

  // フィルター&検索&ソート適用
  const filteredAndSortedData = useMemo(() => {
    let result = currentData;

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(pm => 
        pm.name.toLowerCase().includes(query) ||
        pm.kana.toLowerCase().includes(query) ||
        pm.achievements.some(a => a.toLowerCase().includes(query)) ||
        pm.relatedEvents.toLowerCase().includes(query) ||
        pm.party.toLowerCase().includes(query)
      );
    }

    // 受験頻出度フィルター
    if (filters.frequency !== 'all') {
      result = result.filter(pm => pm.examFrequency === filters.frequency);
    }

    // 時代フィルター
    if (filters.era !== 'all') {
      const eraRange = getEraRange(filters.era);
      if (eraRange) {
        result = result.filter(pm => {
          return !(pm.termEnd < eraRange.start || pm.termStart > eraRange.end);
        });
      }
    }

    // ソート
    const sorted = [...result];
    switch (sortBy) {
      case 'era':
        // 時代順（在任開始年）
        sorted.sort((a, b) => a.termStart - b.termStart);
        break;
      case 'frequency':
        // 受験頻出度順
        const frequencyOrder = { high: 1, medium: 2, low: 3 };
        sorted.sort((a, b) => frequencyOrder[a.examFrequency] - frequencyOrder[b.examFrequency]);
        break;
      case 'name':
        // 名前順（五十音）
        sorted.sort((a, b) => a.kana.localeCompare(b.kana, 'ja'));
        break;
      default:
        break;
    }

    return sorted;
  }, [currentData, searchQuery, filters, sortBy]);

  // 統計データ
  const statistics = useMemo(() => {
    const total = currentData.length;
    const learned = learnedIds.filter(id => currentData.some(pm => pm.id === id)).length;
    const highFrequency = currentData.filter(pm => pm.examFrequency === 'high').length;
    const highLearned = currentData.filter(pm => 
      pm.examFrequency === 'high' && learnedIds.includes(pm.id)
    ).length;

    return {
      total,
      learned,
      learnedPercentage: Math.round((learned / total) * 100),
      highFrequency,
      highLearned,
      highLearnedPercentage: highFrequency > 0 ? Math.round((highLearned / highFrequency) * 100) : 0
    };
  }, [currentData, learnedIds]);

  return (
    <div>
      {/* データモード切替タブ */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 py-3">
            <button
              onClick={() => setDataMode('important')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                dataMode === 'important'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star size={16} />
              重要7首相
            </button>
            <button
              onClick={() => setDataMode('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                dataMode === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users size={16} />
              主要33首相
            </button>
          </div>
        </div>
      </div>

      {/* フィルターバー */}
      <FilterBar
        activeFilters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 統計表示 */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">全体の学習進捗</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-blue-600">
                {statistics.learned}
              </span>
              <span className="text-lg text-gray-600 mb-1">
                / {statistics.total}人
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${statistics.learnedPercentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1 text-right">
              {statistics.learnedPercentage}%
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">頻出首相の進捗</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-red-600">
                {statistics.highLearned}
              </span>
              <span className="text-lg text-gray-600 mb-1">
                / {statistics.highFrequency}人
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${statistics.highLearnedPercentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1 text-right">
              {statistics.highLearnedPercentage}%
            </div>
          </div>
        </div>

        {/* 結果数表示 */}
        <div className="mb-4">
          <div className="text-sm text-gray-600">
            {filteredAndSortedData.length}人の首相が見つかりました
            {searchQuery && (
              <span className="ml-2 text-blue-600 font-semibold">
                「{searchQuery}」
              </span>
            )}
          </div>
        </div>

        {/* 首相カード一覧 */}
        {filteredAndSortedData.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedData.map(pm => {
              const isLearned = learnedIds.includes(pm.id);
              return (
                <div key={pm.id} className="relative">
                  {isLearned && (
                    <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      ✓ 学習済み
                    </div>
                  )}
                  <PrimeMinisterCard pm={pm} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-2">
              {searchQuery 
                ? '該当する首相が見つかりませんでした' 
                : '該当する首相が見つかりませんでした'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({ frequency: 'all', era: 'all' });
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              検索とフィルターをリセット
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
