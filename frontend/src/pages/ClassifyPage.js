import React, { useState } from 'react';

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
      const response = await fetch(`${process.env.REACT_APP_BASE_BACKEND_URL}/classify-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResult(data.data);
      } else {
        throw new Error(data.message || 'Classification failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsClassifying(false);
    }
  };

  const getQualityLabel = (score) => {
    if (score >= 0.8) return { label: 'Excellent', color: 'green' };
    if (score >= 0.6) return { label: 'Good', color: 'yellow' };
    return { label: 'Fair', color: 'gray' };
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Classify Blog Content
        </h1>
        <p className="text-gray-600">
          Test our blog classification system by submitting a URL.
          We'll analyze the content and determine if it's authentic blog content.
        </p>
      </div>

      {/* Classification Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL to Classify
            </label>
            <input
              type="url"
              id="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-black focus:border-transparent
                       placeholder-gray-400"
              placeholder="https://example.com/blog-post"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isClassifying}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isClassifying || !url.trim()}
              className={`inline-flex items-center px-6 py-3 rounded-lg
                       text-base font-medium text-white
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                       ${isClassifying || !url.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
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
                  Classifying...
                </>
              ) : (
                'Classify URL'
              )}
            </button>
          </div>
        </form>

        {/* Results Display */}
        {result && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Classification Results
            </h3>

            <div className="bg-gray-50 rounded-lg p-6">
              {/* Overall Result */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Content Type
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {result.is_blog ? 'Blog Content' : 'Non-Blog Content'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">
                    Quality Score
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 bg-${getQualityLabel(result.quality_score).color}-500`} />
                    <span className="text-xl font-semibold text-gray-900">
                      {(result.quality_score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Scores */}
              {result.classification_details && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Detailed Analysis</h4>
                  {Object.entries(result.classification_details).map(([key, score]) => (
                    <div key={key} className="flex items-center">
                      <span className="w-1/3 text-sm text-gray-500 capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <div className="w-2/3">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div className="text-right">
                              <span className="text-sm font-semibold inline-block text-gray-800">
                                {(score * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${score * 100}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Metadata */}
              {result.metadata && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Content Metadata</h4>
                  <dl className="grid grid-cols-1 gap-4">
                    {Object.entries(result.metadata).map(([key, value]) => (
                      <div key={key} className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace('_', ' ')}
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
          <div className="mt-6">
            <div className="text-red-700 bg-red-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Classification Error</h3>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          How Classification Works
        </h3>
        <div className="space-y-4 text-gray-600">
          <p>
            Our classification system uses multiple factors to determine if content
            is authentic blog material:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Domain analysis (personal blog platforms vs corporate sites)</li>
            <li>Content structure and writing style</li>
            <li>Presence of personal narratives and experiences</li>
            <li>Commercial content density</li>
            <li>SEO optimization signals</li>
          </ul>
          <p>
            URLs are classified in real-time, and results are cached for future
            reference.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClassifyPage;
