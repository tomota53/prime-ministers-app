import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, BookOpen } from 'lucide-react';

const PrimeMinisterCard = ({ pm }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 受験頻出度に応じたバッジのスタイル
  const getFrequencyBadge = (frequency) => {
    const badges = {
      high: { text: '最重要', gradient: 'from-red-500 to-pink-500' },
      medium: { text: '重要', gradient: 'from-yellow-500 to-orange-500' },
      low: { text: '基本', gradient: 'from-blue-500 to-cyan-500' }
    };
    return badges[frequency] || badges.low;
  };

  const badge = getFrequencyBadge(pm.examFrequency);

  return (
    <div className="card-modern overflow-hidden mb-4 animate-fade-in hover:scale-[1.02] transition-transform duration-300">
      {/* カードヘッダー - 常に表示 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl"
      >
        <div className="flex items-start gap-4">
          {/* アイコン */}
          <div className="text-5xl flex-shrink-0 animate-float">
            {pm.imageEmoji}
          </div>

          {/* 基本情報 */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-xl font-bold text-gray-900">
                {pm.name}
              </h3>
              <span className={`bg-gradient-to-r ${badge.gradient} text-white text-xs px-3 py-1 rounded-full font-bold shadow-md`}>
                ★ {badge.text}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 font-medium">
              {pm.kana}
            </p>
            
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="glass-dark px-3 py-1.5 rounded-lg font-semibold text-gray-700">
                {pm.order}
              </span>
              <span className="glass-dark px-3 py-1.5 rounded-lg font-semibold text-gray-700">
                📅 {pm.termStart}年 - {pm.termEnd}年
              </span>
            </div>
          </div>

          {/* 展開アイコン */}
          <div className="flex-shrink-0 text-gray-400 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <ChevronDown size={24} />
          </div>
        </div>
      </button>

      {/* 詳細情報 - 展開時のみ表示 */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 animate-fade-in">
          {/* 政党 */}
          <div className="mb-4 p-3 glass-dark rounded-xl">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-gray-900">🏛️ 政党：</span>
              {pm.party}
            </p>
          </div>

          {/* 主な功績 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-blue-600" />
              <h4 className="text-base font-bold text-gray-900">
                主な功績
              </h4>
            </div>
            <ul className="space-y-2">
              {pm.achievements.map((achievement, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start p-3 glass-dark rounded-lg hover:shadow-md transition-shadow">
                  <span className="text-blue-500 mr-2 text-lg">✓</span>
                  <span className="font-medium">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 語呂合わせ */}
          {pm.mnemonic && (
            <div className="mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={20} className="text-white" />
                  <h4 className="font-bold text-white">
                    覚え方のコツ
                  </h4>
                </div>
                <p className="text-white text-base font-bold leading-relaxed">
                  💡 {pm.mnemonic}
                </p>
              </div>
            </div>
          )}

          {/* 試験対策ヒント */}
          {pm.examTips && (
            <div className="mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📝</span>
                  <h4 className="font-bold text-white">
                    試験対策ヒント
                  </h4>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {pm.examTips}
                </p>
              </div>
            </div>
          )}

          {/* 関連する歴史的出来事 */}
          <div className="p-4 glass-dark rounded-2xl">
            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-lg">📚</span>
              関連する歴史的出来事
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {pm.relatedEvents}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrimeMinisterCard;
