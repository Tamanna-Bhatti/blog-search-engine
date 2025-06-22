import React, { useState } from 'react';
import { handleApiError, safeJsonParse } from '../utils/errorHandler';

function CrawlPage() {
  const [urls, setUrls] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    // Split URLs by newline and filter empty lines
    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urlList.length === 0) {
      setError('Please enter at least one URL');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/crawl`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await safeJsonParse(response);

      if (data.status === 'success' && data.data) {
        setResult(data);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Crawl New Blog Posts
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Add new blogs to our search index by providing their URLs.
          Each URL will be analyzed and classified for blog-quality content.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Crawl Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="urls"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Blog URLs (one per line)
                </label>
                <textarea
                  id="urls"
                  rows="12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl
                           focus:ring-2 focus:ring-black focus:border-transparent
                           placeholder-gray-400 resize-none transition-shadow duration-200
                           hover:shadow-sm"
                  placeholder="https://example.com/blog-post&#10;https://another-blog.com/article"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !urls.trim()}
                  className={`inline-flex items-center px-6 py-3 rounded-xl
                           text-base font-medium text-white
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                           ${isSubmitting || !urls.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 hover:scale-95'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Processing...
                    </>
                  ) : (
                    'Start Crawling'
                  )}
                </button>
              </div>
            </form>

            {/* Results/Error Display */}
            {(result || error) && (
              <div className="mt-6 animate-fadeIn">
                {result && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-green-800">Crawl Started Successfully</h3>
                    </div>
                    <div className="mt-4 text-green-700">
                      <p>Started crawling {result.data.accepted_urls.length} URLs.</p>
                      {result.data.rejected_urls.length > 0 && (
                        <div className="mt-4">
                          <p className="font-medium text-green-800">Skipped URLs:</p>
                          <ul className="mt-2 space-y-1">
                            {result.data.rejected_urls.map((url, index) => (
                              <li key={index} className="text-sm flex items-start space-x-2">
                                <span className="text-red-500">•</span>
                                <span className="flex-1">{url}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="h-6 w-6 text-red-500"
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
                      <h3 className="text-lg font-medium text-red-800">Error</h3>
                    </div>
                    <p className="mt-2 text-red-700">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Guidelines Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Submission Guidelines
            </h3>
            <ul className="space-y-4">
              {[
                {
                  title: 'Direct Links Only',
                  description: 'Submit links to individual blog posts or articles, not homepage URLs.'
                },
                {
                  title: 'Complete URLs',
                  description: 'Include the full URL with https:// or http:// prefix.'
                },
                {
                  title: 'One Per Line',
                  description: 'Enter each URL on a new line for proper processing.'
                },
                {
                  title: 'Quality Check',
                  description: 'URLs will be analyzed for blog-quality content before indexing.'
                },
                {
                  title: 'Processing Time',
                  description: 'Crawling may take a few minutes depending on the number of URLs.'
                }
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg
                    className="h-5 w-5 text-black mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrawlPage;
