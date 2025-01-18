import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css"; 


const AvailabilityForm = ({ availability, onClose, onRefresh }) => {
    const [availabilityDetails, setAvailabilityDetails] = useState(availability ? availability : { id: 0, startDate: '', endDate: '' }); // modificati parametrii modelului dupa cum vreti voi.
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setAvailabilityDetails((AvailabilityDetails) => ({
            ...AvailabilityDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(false);

        try {
            const response = await fetch('https://localhost:7118/api/Availability', {
                method: 'POST',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(availability),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add availability');
            }

            setSuccessMessage(true);
            setAvailabilityDetails({ id: 0, startDate: '', endDate: '' }); // Resetează formularul
            onRefresh(); // Actualizează lista de disponibilități
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={handleSubmit}>

                    <div className="form-input-div">
                        <label>Start Date:</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={availabilityDetails.startDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>End date:</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={availabilityDetails.endDate}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{availability ? "Update" : "Add"} Availability</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AvailabilityForm;