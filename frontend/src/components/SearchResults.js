import React from 'react';
import BlogPostCard from './BlogPostCard';

function SearchResults({ results, isLoading, error }) {
  // Loading State
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-black rounded-full animate-spin border-t-transparent"></div>
          </div>
          <div className="text-center space-y-3">
            <p className="text-lg font-medium text-gray-900">Searching blogs</p>
            <p className="text-gray-500">Finding the most authentic content for you...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-2xl w-full shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Search Error</h3>
              <p className="mt-1 text-gray-600">{error}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No Results State
  if (!results || results.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="text-center max-w-2xl">
          <div className="bg-gray-50 rounded-full p-6 w-24 h-24 mx-auto mb-6">
            <svg
              className="w-full h-full text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No matching results
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try adjusting your search terms or explore different topics. We're constantly adding new blog content to our database.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
            >
              Try Different Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results State
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-medium">
            {results.length}
          </span>
          <h2 className="text-lg font-medium text-gray-900">
            Authentic Blog Posts Found
          </h2>
        </div>
        <div className="mt-2 sm:mt-0 text-sm text-gray-500 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          Sorted by quality score
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((post, index) => (
          <div
            key={post.url}
            className="transform transition-all duration-300 hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.5s ease-out forwards',
            }}
          >
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {results.length >= 10 && (
        <div className="flex justify-center mt-12">
          <button
            type="button"
            className="group inline-flex items-center px-6 py-3 border-2 border-gray-200 
                     text-base font-medium rounded-xl text-gray-700 bg-white 
                     hover:border-black hover:text-black transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <span>Load more results</span>
            <svg
              className="ml-2 w-5 h-5 transform group-hover:translate-y-0.5 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Add animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default SearchResults;
