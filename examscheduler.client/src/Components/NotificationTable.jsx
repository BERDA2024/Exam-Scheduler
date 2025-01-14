import React, { useState, useEffect } from "react";
import { fetchNotifications, deleteNotification } from "../services/notificationService";

const NotificationTable = () => {
    const [notifications, setNotifications] = useState([]);

    // Fetch notifications on component mount
    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };
        loadNotifications();
    }, []);

    // Handle delete notification
    const handleDelete = async (id) => {
        try {
            const success = await deleteNotification(id);
            if (success) {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== id)
                );
            } else {
                console.error("Failed to delete notification");
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Notifications</h2>
            <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
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
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <tr key={notification.id}>
                                <td>{notification.title}</td>
                                <td>{notification.description}</td>
                                <td>{notification.recipientName}</td>
                                <td>{new Date(notification.createdAt).toLocaleString()}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        style={{
                                            backgroundColor: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                                No notifications found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default NotificationTable;
