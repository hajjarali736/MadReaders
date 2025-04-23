export const GOOGLE_BOOKS_API_KEY = "AIzaSyAydsNMj5E3sr3RBZ2u-mN0k0GQN3-AjFo";
export const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1";
export const MAX_RESULTS = 20; // Maximum number of results to return
export const DEFAULT_CATEGORY = "fiction"; // Default category for featured books

const BASE_URL = `${GOOGLE_BOOKS_API_URL}/volumes`;

// Cache to store API responses
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const searchBooks = async (query, options = {}) => {
  try {
    const { orderBy = "relevance", maxResults = MAX_RESULTS } = options;

    // Check cache first
    const cacheKey = `${query}-${orderBy}-${maxResults}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    lastRequestTime = Date.now();

    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(
        query
      )}&orderBy=${orderBy}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        // If rate limited, wait longer and retry
        await delay(5000); // Wait 5 seconds
        return searchBooks(query, options);
      }
      throw new Error("Failed to fetch books");
    }

    const data = await response.json();

    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

export const getFeaturedBooks = async () => {
  try {
    // Featured books using the default category
    const response = await fetch(
      `${BASE_URL}?q=subject:${DEFAULT_CATEGORY}&orderBy=relevance&maxResults=${MAX_RESULTS}&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured books");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching featured books:", error);
    throw error;
  }
};

export const getBestsellers = async () => {
  try {
    // Bestsellers are typically mystery genre
    const response = await fetch(
      `${BASE_URL}?q=subject:mystery&orderBy=relevance&maxResults=${MAX_RESULTS}&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch bestsellers");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    throw error;
  }
};
