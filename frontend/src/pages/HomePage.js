import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

function HomePage() {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_BACKEND_URL}/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setSearchResults(data.data.results);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Find Authentic Blog Content
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover genuine personal blogs and deep-dive articles, 
          free from SEO-optimized and corporate content.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-12">
        <SearchBar 
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>

      {/* Results Section */}
      <div className="mt-8">
        <SearchResults
          results={searchResults}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Features Section */}
      {!searchResults && !isLoading && !error && (
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="text-center px-6">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center 
                          bg-black rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Personal Blogs Only</h3>
            <p className="text-gray-600">
              Focus on authentic content from real people sharing their experiences
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center px-6">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center 
                          bg-black rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Quality Filtered</h3>
            <p className="text-gray-600">
              Smart classification removes SEO-spam and corporate content
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center px-6">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center 
                          bg-black rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Optimized search delivers relevant results instantly
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
