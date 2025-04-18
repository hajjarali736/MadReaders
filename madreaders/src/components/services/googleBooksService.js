export const GOOGLE_BOOKS_API_KEY = 'AIzaSyBR58b5y2UJLqHwy_5xeXxvHOkE7SVSpXk';
export const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1';
export const MAX_RESULTS = 20; // Maximum number of results to return
export const DEFAULT_CATEGORY = 'fiction'; // Default category for featured books

const BASE_URL = `${GOOGLE_BOOKS_API_URL}/volumes`;

export const searchBooks = async (query, options = {}) => {
    try {
        const { orderBy = 'relevance', maxResults = MAX_RESULTS } = options;
        const response = await fetch(
            `${BASE_URL}?q=${encodeURIComponent(query)}&orderBy=${orderBy}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching books:', error);
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
            throw new Error('Failed to fetch featured books');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching featured books:', error);
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
            throw new Error('Failed to fetch bestsellers');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching bestsellers:', error);
        throw error;
    }
}; 