import { getAuthHeader } from '../Utils/AuthUtils';

const API_BASE_URL = "https://localhost:7118/api/Subject";
const authHeader = getAuthHeader();

export const fetchExams = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                ...authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch exams');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching exams:", error);
        return [];
    }
};
