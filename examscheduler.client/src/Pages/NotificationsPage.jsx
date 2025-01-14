<<<<<<< Updated upstream
﻿import React from 'react';
import NotificationInbox from '../components/NotificationInbox'; // Importă componenta Inbox
import '../styles/NotificationsPage.css';
=======
import React from "react";
import NotificationTable from "../components/NotificationTable";
>>>>>>> Stashed changes

const NotificationsPage = () => {
    const recipientId = "user123"; // Exemplu: ID-ul utilizatorului curent

    return (
<<<<<<< Updated upstream
        <div className="notifications-container">
            <h1 className="notifications-title">Notifications</h1>
            <NotificationInbox recipientId={recipientId} />
=======
        <div>
            <h1>Notifications</h1>
            <NotificationTable />
>>>>>>> Stashed changes
        </div>
    );
};

export default NotificationsPage;
