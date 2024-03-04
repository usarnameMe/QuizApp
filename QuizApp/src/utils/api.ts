import axios from 'axios';

const cache = {
    categories: { data: null, timestamp: 0 },
    questions: new Map<string, { data: null | any[]; timestamp: number }>()
};

const CACHE_DURATION = 1 * 10 * 100; 

export const fetchCategories = async () => {
    const now = Date.now();
    if (cache.categories.data && now - cache.categories.timestamp < CACHE_DURATION) {
        return cache.categories.data;
    }

    try {
        const response = await axios.get('https://opentdb.com/api_category.php');
        cache.categories = { data: response.data.trivia_categories, timestamp: Date.now() };
        return response.data.trivia_categories;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const fetchQuestions = async (category: string, difficulty: string) => {
    const cacheKey = `${category}-${difficulty}`;
    const now = Date.now();
    if (cache.questions.has(cacheKey) && now - cache.questions.get(cacheKey).timestamp < CACHE_DURATION) {
        return cache.questions.get(cacheKey).data;
    }

    try {
        const url = `https://opentdb.com/api.php?amount=10${category ? `&category=${category}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}&type=multiple`;
        const response = await axios.get(url);
        cache.questions.set(cacheKey, { data: response.data.results, timestamp: Date.now() });
        return response.data.results;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
            console.log("You've hit the rate limit. Please wait and try again later.");
        } else {
            console.log(error);
        }
        return [];
    }
};
