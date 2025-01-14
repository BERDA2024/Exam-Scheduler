import React, { useState, useEffect } from 'react';

const NotificationInbox = ({ notifications = [] }) => {
    const [localNotifications, setLocalNotifications] = useState([]);

    useEffect(() => {
        // Actualizează notificările locale atunci când se primesc noi date
        if (Array.isArray(notifications)) {
            setLocalNotifications(notifications);
        } else {
            console.error('Invalid notifications data:', notifications);
        }
    }, [notifications]);

    // Funcția pentru a șterge notificarea
    const deleteNotification = async (notificationId) => {
        try {
            const response = await fetch(
                `https://localhost:5001/api/notifications/${notificationId}`, // Fără recipientId
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                // Elimină notificarea din lista locală
                setLocalNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== notificationId)
                );
                console.log('Notification deleted successfully');
            } else {
                console.error('Failed to delete notification');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            {localNotifications.length === 0 ? (
                <p>No notifications to display.</p>
            ) : (
                localNotifications.map((notification, index) => (
                    <div key={index}>
                        <h3>{notification.title}</h3>
                        <p>{notification.description}</p>
                        <small>From: {notification.senderId}</small>
                        {/* Butonul de ștergere */}
                        <button onClick={() => deleteNotification(notification.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationInbox;
