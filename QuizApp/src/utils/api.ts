import axios from 'axios';

export const fetchCategories = async () => {
    try {
        const response = await axios.get('https://opentdb.com/api_category.php');
        return response.data.trivia_categories;
    } catch (error) {
        console.log(error);
        return [];
    }
}