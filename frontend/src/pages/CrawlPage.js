import React, { useState } from 'react';

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
      const response = await fetch(`${process.env.REACT_APP_BASE_BACKEND_URL}/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResult(data);
      } else {
        throw new Error(data.message || 'Failed to start crawl');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Crawl New Blog Posts
        </h1>
        <p className="text-gray-600">
          Add new blogs to our search index by providing their URLs below.
          Each URL will be analyzed and classified for blog-quality content.
        </p>
      </div>

      {/* Crawl Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="urls"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Blog URLs (one per line)
            </label>
            <textarea
              id="urls"
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-black focus:border-transparent
                       placeholder-gray-400 resize-none"
              placeholder="https://example.com/blog-post
https://another-blog.com/article"
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
              className={`inline-flex items-center px-6 py-3 rounded-lg
                       text-base font-medium text-white
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                       ${isSubmitting || !urls.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
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
                  Starting Crawl...
                </>
              ) : (
                'Start Crawling'
              )}
            </button>
          </div>
        </form>

        {/* Results/Error Display */}
        {(result || error) && (
          <div className="mt-6 p-4 rounded-lg border">
            {result && (
              <div className="text-green-700 bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Crawl Started</h3>
                <p>Successfully started crawling {result.data.accepted_urls.length} URLs.</p>
                {result.data.rejected_urls.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Rejected URLs:</p>
                    <ul className="list-disc list-inside mt-1">
                      {result.data.rejected_urls.map((url, index) => (
                        <li key={index} className="text-sm">{url}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="text-red-700 bg-red-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Error</h3>
                <p>{error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Guidelines for URL Submission
        </h3>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-gray-400 mr-2"
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
            Submit direct links to individual blog posts or articles
          </li>
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-gray-400 mr-2"
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
            Ensure URLs are complete (including https:// or http://)
          </li>
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-gray-400 mr-2"
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
            Avoid submitting homepage URLs or category pages
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CrawlPage;
