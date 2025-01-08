import axios from 'axios';

// Fetch notifications for a specific user
export const fetchNotifications = async (recipientId) => {
    const response = await axios.get(`/api/notifications/${recipientId}`);
    return response.data;
};

// Add a new notification
export const addNotification = async (notification) => {
    await axios.post('/api/notifications', notification);
};
