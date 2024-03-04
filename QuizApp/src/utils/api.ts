const cache = {
    categories: { data: null, timestamp: 0 },
    questions: new Map<string, { data: null | any[]; timestamp: number }>()
};

const CACHE_DURATION = 1 * 30 * 1000; 

export const fetchCategories = async () => {
    const now = Date.now();
    if (cache.categories.data && now - cache.categories.timestamp < CACHE_DURATION) {
        return cache.categories.data;
    }

    try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        cache.categories = { data: data.trivia_categories, timestamp: Date.now() };
        return data.trivia_categories;
    } catch (error) {
        console.error(error);
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
        const response = await fetch(url);
        const data = await response.json();
        cache.questions.set(cacheKey, { data: data.results, timestamp: Date.now() });
        return data.results;
    } catch (error) {
        console.error(error);
        return [];
    }
};
