import { Filter } from 'lucide-react';

const FilterBar = ({ activeFilters, onFilterChange }) => {
  // 受験頻出度フィルター
  const frequencyFilters = [
    { id: 'all', label: 'すべて', color: 'bg-gray-500' },
    { id: 'high', label: '最重要', color: 'bg-red-500' },
    { id: 'medium', label: '重要', color: 'bg-yellow-500' },
    { id: 'low', label: '基本', color: 'bg-blue-500' }
  ];

  // 時代フィルター
  const eraFilters = [
    { id: 'all', label: 'すべて' },
    { id: 'meiji', label: '明治' },
    { id: 'taisho', label: '大正' },
    { id: 'showa', label: '昭和' },
    { id: 'heisei', label: '平成' },
    { id: 'reiwa', label: '令和' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* 受験頻出度フィルター */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {frequencyFilters.map((filter) => {
            const isActive = activeFilters.frequency === filter.id;
            
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange('frequency', filter.id)}
                className={`
                  px-2 py-1 rounded-md text-xs font-semibold
                  transition-all duration-200
                  ${isActive
                    ? `${filter.color} text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* 時代フィルター */}
        <div className="flex flex-wrap gap-1.5">
          {eraFilters.map((filter) => {
            const isActive = activeFilters.era === filter.id;
            
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange('era', filter.id)}
                className={`
                  px-2 py-1 rounded-md text-xs font-semibold
                  transition-all duration-200
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
