import React from 'react';
import NotificationInbox from '../components/NotificationInbox'; // Importă componenta Inbox
import '../styles/NotificationsPage.css';



const NotificationsPage = () => {
    const recipientId = "user123"; // Exemplu: ID-ul utilizatorului curent

    return (
        <div className="notifications-container">
            <h1 className="notifications-title">Notifications</h1>
            <NotificationInbox recipientId={recipientId} />
        </div>
    );
};

export default NotificationsPage;
