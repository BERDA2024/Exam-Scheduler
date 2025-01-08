import React, { useState, useEffect } from 'react';

const NotificationInbox = ({ notifications, recipientId }) => {
    // Verificăm dacă notifications este un array valid
    if (!Array.isArray(notifications)) {
        console.error('Notifications is not an array:', notifications);
        return <div>No notifications available.</div>;
    }

    // Funcția pentru a șterge notificarea
    const deleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`https://localhost:5001/api/notifications/${notificationId}?recipientId=${recipientId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Elimină notificarea din lista locală
                setNotifications((prevNotifications) =>
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
            {notifications.length === 0 ? (
                <p>No notifications to display.</p>
            ) : (
                notifications.map((notification, index) => (
                    <div key={index}>
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        <small>From: {notification.sender}</small>
                        {/* Butonul de ștergere */}
                        <button onClick={() => deleteNotification(notification.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationInbox;
