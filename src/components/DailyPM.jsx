import { useState, useEffect } from 'react';
import { Calendar, Lightbulb, BookOpen, RefreshCw } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

const DailyPM = ({ primeMinistersData }) => {
  const [dailyPM, setDailyPM] = useState(null);
  const [lastDate, setLastDate] = useLocalStorage('dailyPMDate', '');
  const [studyStreak, setStudyStreak] = useLocalStorage('studyStreak', 0);
  const [lastStudyDate, setLastStudyDate] = useLocalStorage('lastStudyDate', '');

  // 今日の日付を取得
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  // 連続学習日数を更新
  useEffect(() => {
    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

    if (lastStudyDate === yesterdayString) {
      // 昨日も学習していた場合、ストリークを継続
      if (lastStudyDate !== today) {
        setStudyStreak(studyStreak + 1);
        setLastStudyDate(today);
      }
    } else if (lastStudyDate !== today) {
      // 1日以上空いた場合、ストリークをリセット
      setStudyStreak(1);
      setLastStudyDate(today);
    }
  }, []);

  // 今日の首相を選択
  useEffect(() => {
    const today = getTodayString();
    
    if (lastDate !== today) {
      // 新しい日なので、ランダムに首相を選択
      const randomIndex = Math.floor(Math.random() * primeMinistersData.length);
      setDailyPM(primeMinistersData[randomIndex]);
      setLastDate(today);
    } else {
      // 既に今日の首相が選択されている場合は、LocalStorageから復元
      // （簡易的に、日付が同じなら最初の首相IDを使用）
      const dayHash = today.split('-').reduce((a, b) => parseInt(a) + parseInt(b), 0);
      const index = dayHash % primeMinistersData.length;
      setDailyPM(primeMinistersData[index]);
    }
  }, [primeMinistersData, lastDate, setLastDate]);

  // 手動で次の首相を選択
  const selectNextPM = () => {
    if (!dailyPM) return;
    const currentIndex = primeMinistersData.findIndex(pm => pm.id === dailyPM.id);
    const nextIndex = (currentIndex + 1) % primeMinistersData.length;
    setDailyPM(primeMinistersData[nextIndex]);
  };

  if (!dailyPM) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ストリーク表示 */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl p-3 mb-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <div>
              <div className="text-xs opacity-90">連続学習日数</div>
              <div className="text-2xl font-bold">{studyStreak}日</div>
            </div>
          </div>
          <div className="text-4xl">🔥</div>
        </div>
      </div>

      {/* 今日の首相カード */}
      <div className="card-modern p-6 mb-4 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={28} className="text-blue-600 animate-float" />
          <h2 className="text-3xl font-bold gradient-text">今日の首相</h2>
        </div>

        {/* 首相情報 */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl">{dailyPM.imageEmoji}</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {dailyPM.name}
                <span className="text-sm text-gray-600 ml-2">（{dailyPM.kana}）</span>
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-semibold">
              {dailyPM.order}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-semibold">
              {dailyPM.termStart}年 - {dailyPM.termEnd}年
            </span>
            <span className={`px-2 py-1 rounded-md text-xs font-semibold text-white ${
              dailyPM.examFrequency === 'high' ? 'bg-red-500' :
              dailyPM.examFrequency === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}>
              {dailyPM.examFrequency === 'high' ? '最重要' :
               dailyPM.examFrequency === 'medium' ? '重要' : '基本'}
            </span>
          </div>
        </div>

        {/* 語呂合わせ */}
        {dailyPM.mnemonic && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 mb-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={24} className="text-white animate-float" />
              <h4 className="font-bold text-white text-lg">覚え方のコツ</h4>
            </div>
            <p className="text-white text-lg font-bold leading-relaxed">
              💡 {dailyPM.mnemonic}
            </p>
          </div>
        )}

        {/* 主な功績 */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            主な功績
          </h4>
          <ul className="space-y-2">
            {dailyPM.achievements.map((achievement, index) => (
              <li key={index} className="text-gray-700 flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 試験対策ヒント */}
        {dailyPM.examTips && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 mb-4 shadow-lg">
            <h4 className="font-bold text-white mb-3 text-lg flex items-center gap-2">
              <span className="text-2xl">📝</span>
              試験対策ヒント
            </h4>
            <p className="text-white text-sm leading-relaxed">
              {dailyPM.examTips}
            </p>
          </div>
        )}

        {/* 関連する歴史的出来事 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">
            関連する歴史的出来事
          </h4>
          <p className="text-gray-700 text-sm">
            {dailyPM.relatedEvents}
          </p>
        </div>
      </div>

      {/* アクションボタン */}
      <button
        onClick={selectNextPM}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <RefreshCw size={20} />
        次の首相を見る
      </button>

      {/* ヒント */}
      <p className="text-center text-gray-500 text-sm mt-4">
        毎日違う首相が表示されます。継続して学習しよう！
      </p>
    </div>
  );
};

export default DailyPM;
