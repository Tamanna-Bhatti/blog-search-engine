import React from 'react';

function BlogPostCard({ post }) {
  const {
    title,
    url,
    snippet,
    domain,
    quality_score,
    crawled_at
  } = post;

  // Format the crawled date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Format domain (remove www. and trailing /)
  const formatDomain = (domain) => {
    return domain.replace(/^www\./i, '').replace(/\/+$/, '');
  };

  // Calculate quality indicator and color
  const getQualityInfo = (score) => {
    if (score >= 0.8) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score >= 0.6) return { label: 'Good', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { label: 'Fair', color: 'bg-gray-400', textColor: 'text-gray-700' };
  };

  const qualityInfo = getQualityInfo(quality_score);

  // Generate placeholder image based on domain
  const placeholderImage = `https://source.unsplash.com/400x225/?technology,blog&${domain}`;

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden 
                      transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                      flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={placeholderImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm font-medium truncate">
            {formatDomain(domain)}
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 flex-none">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors duration-200"
          >
            {title}
          </a>
        </h2>

        {/* Snippet */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {snippet}
        </p>

        {/* Metadata Footer */}
        <div className="flex flex-col space-y-3 text-sm flex-none">
          {/* Quality Score and Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${qualityInfo.textColor} bg-opacity-10`}>
                <span className={`w-1.5 h-1.5 rounded-full ${qualityInfo.color} mr-1.5`}></span>
                {qualityInfo.label}
              </span>
            </div>
            <time className="text-gray-500" dateTime={crawled_at}>
              {formatDate(crawled_at)}
            </time>
          </div>

          {/* Read More Link */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 
                     rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 
                     transition-colors duration-200 group"
          >
            Read Article
            <svg
              className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

export default BlogPostCard;
