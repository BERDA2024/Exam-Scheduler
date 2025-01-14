import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/notifications"; // Schimbă URL-ul dacă backend-ul e hostat în altă parte.

export const fetchNotifications = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/1`); // Exemplu: Fetch pentru utilizatorul cu ID 1.
        return response.data;
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
