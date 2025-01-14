import axios from 'axios';

// Fetch notifications for the current user
export const fetchNotifications = async () => {
    const response = await axios.get('/api/notifications', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
    await axios.delete(`/api/notifications/${notificationId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};
