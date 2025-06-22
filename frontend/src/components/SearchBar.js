import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Popular search suggestions
  const suggestions = [
    'software engineering',
    'product management',
    'personal growth',
    'tech startups',
    'web development'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (searchQuery) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      saveSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    saveSearch(suggestion);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className={`relative ${isFocused ? 'z-50' : 'z-40'}`}>
        <form onSubmit={handleSubmit} className="relative">
          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search authentic blog posts..."
            className="w-full px-4 py-4 pl-12 pr-16
              text-lg text-gray-900
              bg-white border border-gray-200
              rounded-2xl focus:ring-2 focus:ring-black
              focus:border-transparent
              transition-all duration-300
              placeholder-gray-400
              shadow-sm
              hover:shadow-md
              focus:shadow-lg"
            disabled={isLoading}
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className={`h-5 w-5 transition-colors duration-200 ${
                isFocused ? 'text-black' : 'text-gray-400'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`absolute inset-y-2 right-2 flex items-center px-6
              text-sm font-medium rounded-xl
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-black
              ${query.trim() && !isLoading
                ? 'text-white bg-black hover:bg-gray-800 hover:scale-95'
                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : (
              'Search'
            )}
          </button>
        </form>

        {/* Search Suggestions Dropdown */}
        {isFocused && (
          <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            {recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="block w-full text-left px-2 py-1.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{search}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p className="flex items-center justify-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Try searching for topics like "web development", "tech startups", or "personal growth"</span>
        </p>
      </div>
    </div>
  );
}

export default SearchBar;
