import React from 'react';
import { BookOpen, X } from 'lucide-react';

export default function SearchHistory({
  recentSearches,
  onSearchSelect,
  onClearHistory,
  onRemoveSearch
}) {
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Recent Searches</h3>
        <button
          onClick={onClearHistory}
          className="text-sm text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer"
        >
          Clear History
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((term, index) => (
          <div
            key={index}
            className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors duration-200"
          >
            <button
              onClick={() => onSearchSelect(term)}
              className="flex items-center bg-transparent border-none cursor-pointer"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {term}
            </button>
            {onRemoveSearch && (
              <button
                onClick={() => onRemoveSearch(term)}
                className="ml-2 bg-transparent border-none cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}