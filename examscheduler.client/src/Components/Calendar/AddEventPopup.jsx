import React, { useState } from 'react';
import './AddEventPopup.css';

const AddEventPopup = ({ onClose }) => {
    const [eventName, setEventName] = useState('');

    const handleAddEvent = () => {
        // Add event logic (e.g., send the event to the backend)
        console.log(`Adding event: ${eventName}`);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Add Event</h3>
                <input
                    type="text"
                    placeholder="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />
                <button onClick={handleAddEvent}>Add</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddEventPopup;