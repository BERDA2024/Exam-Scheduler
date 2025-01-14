import React from 'react';
import NotificationInbox from '../components/NotificationInbox';
import '../styles/NotificationsPage.css';

const NotificationsPage = () => {
    return (
        <div className="notifications-container">
            <h1 className="notifications-title">Notifications</h1>
            <NotificationInbox />
        </div>
    );
};

export default NotificationsPage;
