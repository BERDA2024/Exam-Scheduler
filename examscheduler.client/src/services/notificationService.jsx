import { getAuthHeader } from '../Utils/AuthUtils';

const API_BASE_URL = "https://localhost:7118/api/Notifications";
const authHeader = getAuthHeader();
export const fetchNotifications = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                ...authHeader,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const deleteNotification = async (id) => {
    try {
        if (window.confirm("Are you sure you want to delete this user?")) {

            const response = await fetch(API_BASE_URL + `/${id}`, {
                method: "DELETE",
                headers: { ...authHeader }
            });

            if (!response.ok) {
                throw new Error('Failed to remove notification');
            }
            return true;
        }
    } catch (error) {
        console.error("Error deleting notification:", error);
        return false;
    }
};
