import React, { useState } from "react";
import './NotificationSettingsPage.css';

const NotificationSettingsPage = () => {
    // Istoricul notificărilor rămâne în continuare în stare
    const [notificationHistory, setNotificationHistory] = useState([
        /* Exemplu de notificări pentru teste
        {
            id: 1,
            type: "email",
            message: "Examen la matematică pe 10 februarie",
            dateTime: "2025-02-10T09:00",
            category: "examene",
        },
        {
            id: 2,
            type: "sms",
            message: "Modificare orar la fizică",
            dateTime: "2025-01-15T14:00",
            category: "modificari",
        },*/
    ]);

    // Funcția pentru ștergerea unei notificări
    const handleDeleteNotification = (id) => {
        setNotificationHistory(notificationHistory.filter((notification) => notification.id !== id));
    };

    return (
        <div className="notification-settings-page">
            <h2>Istoricul Notificărilor</h2>

            {/* Istoricul notificărilor */}
            <div className="notification-history">
                <div className="notification-category">
                    <h4>Examene</h4>
                    {notificationHistory.filter(item => item.category === 'examene').length === 0 ? (
                        <p>Nu există notificări pentru examene.</p>
                    ) : (
                        <ul>
                            {notificationHistory.filter(item => item.category === 'examene').map((notification) => (
                                <li key={notification.id} className="notification-item">
                                    <p><strong>{notification.type.toUpperCase()}</strong></p>
                                    <p>{notification.message}</p>
                                    <p>Data și ora notificării: {new Date(notification.dateTime).toLocaleString()}</p>
                                    <button className="delete-button" onClick={() => handleDeleteNotification(notification.id)}>
                                        Șterge
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="notification-category">
                    <h4>Modificări</h4>
                    {notificationHistory.filter(item => item.category === 'modificari').length === 0 ? (
                        <p>Nu există notificări pentru modificări.</p>
                    ) : (
                        <ul>
                            {notificationHistory.filter(item => item.category === 'modificari').map((notification) => (
                                <li key={notification.id} className="notification-item">
                                    <p><strong>{notification.type.toUpperCase()}</strong></p>
                                    <p>{notification.message}</p>
                                    <p>Data și ora notificării: {new Date(notification.dateTime).toLocaleString()}</p>
                                    <button className="delete-button" onClick={() => handleDeleteNotification(notification.id)}>
                                        Șterge
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationSettingsPage;
