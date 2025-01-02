import React, { useState } from "react";
import './NotificationSettingsPage.css';

const NotificationSettingsPage = () => {
    const [notificationType, setNotificationType] = useState("email");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationDateTime, setNotificationDateTime] = useState(""); // Data si ora fara secunde
    const [notificationHistory, setNotificationHistory] = useState([]);

    const handleTypeChange = (e) => {
        setNotificationType(e.target.value);
    };

    const handleMessageChange = (e) => {
        setNotificationMessage(e.target.value);
    };

    const handleDateTimeChange = (e) => {
        setNotificationDateTime(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newNotification = {
            id: Date.now(),
            type: notificationType,
            message: notificationMessage,
            dateTime: notificationDateTime,
        };

        setNotificationHistory([...notificationHistory, newNotification]);

        // Reset the form after saving
        setNotificationType("email");
        setNotificationMessage("");
        setNotificationDateTime("");
    };

    const handleDeleteNotification = (id) => {
        setNotificationHistory(notificationHistory.filter((notification) => notification.id !== id));
    };

    return (
        <div className="notification-settings-page">
            <h2>Configurare Notificări</h2>

            {/* Formular pentru adăugarea unei notificări */}
            <form className="add-notification-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="notification-type">Tipul notificării:</label>
                    <select
                        id="notification-type"
                        value={notificationType}
                        onChange={handleTypeChange}
                    >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="push">Push Notification</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="notification-message">Mesajul notificării:</label>
                    <textarea
                        id="notification-message"
                        value={notificationMessage}
                        onChange={handleMessageChange}
                        placeholder="Introduceți mesajul notificării"
                    />
                </div>

                <div>
                    <label htmlFor="notification-datetime">Selectează data și ora:</label>
                    <input
                        type="datetime-local"
                        id="notification-datetime"
                        value={notificationDateTime}
                        onChange={handleDateTimeChange}
                        min="2024-01-01T00:00" // Limitează data la un minim de 1 ianuarie 2024
                    />
                </div>

                <button type="submit">Adaugă notificare</button>
            </form>

            {/* Istoricul notificărilor */}
            <div className="notification-history">
                <h3>Istoricul notificărilor</h3>
                {notificationHistory.length === 0 ? (
                    <p>Nu există notificări salvate.</p>
                ) : (
                    <ul>
                        {notificationHistory.map((notification) => (
                            <li
                                key={notification.id}
                                className={`notification-item ${notification.type}`}
                            >
                                <p><strong>{notification.type.toUpperCase()}</strong></p>
                                <p>{notification.message}</p>
                                <p>Data și ora notificării: {new Date(notification.dateTime).toLocaleString()}</p>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteNotification(notification.id)}
                                >
                                    Șterge
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationSettingsPage;
