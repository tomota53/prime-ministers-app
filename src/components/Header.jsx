import { BookOpen, Trophy, List, Sparkles, Book, ShoppingBag } from 'lucide-react';

const Header = ({ currentMode, onModeChange, progress }) => {
  const modes = [
    { id: 'study', label: '学習', icon: BookOpen },
    { id: 'quiz', label: 'クイズ', icon: Trophy },
    { id: 'list', label: '一覧', icon: List },
    { id: 'glossary', label: '用語集', icon: Book },
    { id: 'materials', label: '📚教材', icon: ShoppingBag }
  ];

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* アプリタイトル */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            <h1 className="text-xl font-bold gradient-text">
              首相マスター
            </h1>
          </div>
          <p className="text-gray-600 text-xs">
            🎓 中学受験
          </p>
        </div>

        {/* モード切替ボタン */}
        <div className="flex gap-2 justify-center mb-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'glass-dark text-gray-700 hover:shadow-md'
                  }
                `}
              >
                <Icon size={16} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

export default Header;
