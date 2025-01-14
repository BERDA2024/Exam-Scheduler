import React, { useState, useEffect } from "react";
import { fetchNotifications, deleteNotification } from "../services/notificationService";

const NotificationTable = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch notifications on component mount
        const loadNotifications = async () => {
            const data = await fetchNotifications();
            setNotifications(data);
        };
        loadNotifications();
    }, []);

    const handleDelete = async (id) => {
        const success = await deleteNotification(id);
        if (success) {
            setNotifications(notifications.filter((notification) => notification.id !== id));
        }
    };

    return (
        <div style={{ padding: "15px" }}>
            <h2>Notifications</h2>
            <table border="1" style={{ width: "100%", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Recipient</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map((notification) => (
                        <tr key={notification.id}>
                            <td>{notification.title}</td>
                            <td>{notification.description}</td>
                            <td>{notification.recipientName}</td>
                            <td>{new Date(notification.createdAt).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleDelete(notification.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NotificationTable;
