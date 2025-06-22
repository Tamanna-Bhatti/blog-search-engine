/**
 * Handles API response errors and returns user-friendly error messages
 */
export const handleApiError = (error) => {
  // Network or request errors
  if (!error.response) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Parse JSON errors
  if (error.message && error.message.includes('Unexpected token')) {
    return 'The server returned an invalid response. Please try again later.';
  }

  // Server errors
  const status = error.response?.status;
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Safely parses JSON response
 */
export const safeJsonParse = async (response) => {
  try {
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON response from server');
  }
};
