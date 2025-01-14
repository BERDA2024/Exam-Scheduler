import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/notifications"; // Înlocuiește cu URL-ul tău

export const fetchNotifications = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data; // Ar trebui să returneze o listă de notificări
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const deleteNotification = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting notification:", error);
        return false;
    }
};
