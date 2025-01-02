import React, { useState } from 'react';
import './NotificationSettingsForm.css';

const NotificationSettingsForm = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [notificationFrequency, setNotificationFrequency] = useState('daily');
    const [notificationHistory, setNotificationHistory] = useState([
        { date: '2024-12-08', message: 'Reminder pentru examenul de mâine la ora 16:00' },
        { date: '2024-12-07', message: 'S-a adăugat un document nou în platformă.' },
        { date: '2024-12-06', message: 'Notificare: Examenele sunt programate pentru săptămâna viitoare.' },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulează salvarea configurațiilor
        console.log('Configurări salvate:', {
            emailNotifications,
            smsNotifications,
            pushNotifications,
            notificationFrequency,
        });
        alert('Configurările au fost salvate cu succes!');
    };

    return (
        <div className="notification-settings-container">
            <form className="notification-settings-form" onSubmit={handleSubmit}>
                <h2>Configurare Notificări</h2>
                <div className="form-section">
                    <h3>Canale de notificare</h3>
                    <label>
                        <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                        />
                        Notificări prin email
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={smsNotifications}
                            onChange={(e) => setSmsNotifications(e.target.checked)}
                        />
                        Notificări prin SMS
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={pushNotifications}
                            onChange={(e) => setPushNotifications(e.target.checked)}
                        />
                        Notificări push
                    </label>
                </div>

                <div className="form-section">
                    <h3>Frecvență notificări</h3>
                    <label>
                        <input
                            type="radio"
                            name="frequency"
                            value="instant"
                            checked={notificationFrequency === 'instant'}
                            onChange={(e) => setNotificationFrequency(e.target.value)}
                        />
                        Imediat ce apare o notificare
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="frequency"
                            value="daily"
                            checked={notificationFrequency === 'daily'}
                            onChange={(e) => setNotificationFrequency(e.target.value)}
                        />
                        Zilnic (sumar)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="frequency"
                            value="weekly"
                            checked={notificationFrequency === 'weekly'}
                            onChange={(e) => setNotificationFrequency(e.target.value)}
                        />
                        Săptămânal
                    </label>
                </div>

                <button type="submit" className="save-button">Salvează Configurările</button>
            </form>

            <div className="notification-history">
                <h2>Istoric Notificări</h2>
                {notificationHistory.length > 0 ? (
                    <ul>
                        {notificationHistory.map((item, index) => (
                            <li key={index}>
                                <span className="history-date">{item.date}:</span> {item.message}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nu există notificări în istoric.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationSettingsForm;
