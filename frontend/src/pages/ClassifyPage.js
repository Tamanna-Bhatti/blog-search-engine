import React, { useState } from 'react';
import { handleApiError, safeJsonParse } from '../utils/errorHandler';

function ClassifyPage() {
  const [url, setUrl] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsClassifying(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/classify-url`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await safeJsonParse(response);

      if (data.status === 'success' && data.data) {
        setResult(data.data);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsClassifying(false);
    }
  };

  const getQualityInfo = (score) => {
    if (score >= 0.8) return { label: 'Excellent', color: 'green', textColor: 'text-green-700', bgColor: 'bg-green-500' };
    if (score >= 0.6) return { label: 'Good', color: 'yellow', textColor: 'text-yellow-700', bgColor: 'bg-yellow-500' };
    return { label: 'Fair', color: 'gray', textColor: 'text-gray-700', bgColor: 'bg-gray-500' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Classify Blog Content
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Test our blog classification system by submitting a URL.
          We'll analyze the content and determine if it's authentic blog content.
        </p>
      </div>

      {/* Classification Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL to Classify
            </label>
            <div className="relative">
              <input
                type="url"
                id="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl
                         focus:ring-2 focus:ring-black focus:border-transparent
                         placeholder-gray-400 pr-12"
                placeholder="https://example.com/blog-post"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isClassifying}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isClassifying || !url.trim()}
              className={`inline-flex items-center px-6 py-3 rounded-xl
                       text-base font-medium text-white
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                       ${isClassifying || !url.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 hover:scale-95'
                }`}
            >
              {isClassifying ? (
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
                  Analyzing Content...
                </>
              ) : (
                'Classify URL'
              )}
            </button>
          </div>
        </form>

        {/* Results Display */}
        {result && (
          <div className="mt-8 border-t border-gray-200 pt-8 animate-fadeIn">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Classification Results
            </h3>

            <div className="bg-gray-50 rounded-xl p-6">
              {/* Overall Result */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-gray-500">
                    Content Type
                  </p>
                  <div className="mt-1 flex items-center justify-center sm:justify-start space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      result.is_blog ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {result.is_blog ? 'Blog Content' : 'Non-Blog Content'}
                    </span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-sm font-medium text-gray-500">
                    Quality Score
                  </p>
                  <div className="mt-1 flex items-center justify-center sm:justify-end">
                    <div className={`px-4 py-2 rounded-lg ${getQualityInfo(result.quality_score).textColor} bg-opacity-10`}>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${getQualityInfo(result.quality_score).bgColor}`} />
                        <span className="font-semibold">
                          {getQualityInfo(result.quality_score).label} ({(result.quality_score * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Scores */}
              {result.classification_details && (
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900">Detailed Analysis</h4>
                  <div className="grid gap-4">
                    {Object.entries(result.classification_details).map(([key, score]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="w-full sm:w-1/3 text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <div className="w-full sm:w-2/3">
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div className="text-right">
                                <span className="text-sm font-semibold text-gray-800">
                                  {(score * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                              <div
                                style={{ width: `${score * 100}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black transition-all duration-500 ease-out"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {result.metadata && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Content Metadata</h4>
                  <dl className="grid grid-cols-1 gap-4">
                    {Object.entries(result.metadata).map(([key, value]) => (
                      <div key={key} className="sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200">
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 animate-fadeIn">
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
                <h3 className="text-lg font-medium text-red-800">Classification Error</h3>
              </div>
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          How Classification Works
        </h3>
        <div className="space-y-4 text-gray-600">
          <p>
            Our classification system uses multiple factors to determine if content
            is authentic blog material:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              'Domain analysis (personal blog platforms vs corporate sites)',
              'Content structure and writing style',
              'Presence of personal narratives and experiences',
              'Commercial content density',
              'SEO optimization signals',
              'Content authenticity metrics'
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
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray-500">
            URLs are classified in real-time, and results are cached for future
            reference. The system continuously learns and improves its classification
            accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClassifyPage;
