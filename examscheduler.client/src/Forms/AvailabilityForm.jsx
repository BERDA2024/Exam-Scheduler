import React, { useState } from 'react';
import { getAuthHeader } from '../Utils/AuthUtils';

const AvailabilityForm = () => {
    const [availabilityDetails, setAvailabilityDetails] = useState({ StartDate: '', EndDate: '' });

    const [error, setError] = useState('');

    const authHeader = getAuthHeader();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAvailabilityDetails((availabilityDetails) => ({
            ...availabilityDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Checks if the authorization header is not null means the user is connected
        if (authHeader != null) {
            try {
                const response = await fetch('https://localhost:7118/api/Availability', {
                    method: 'POST',
                    headers: {
                        ...authHeader,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        StartDate: availabilityDetails.StartDate,
                        EndDate: availabilityDetails.EndDate
                    }),
                });

                if (response.ok) {
                    console.log('Added availability.');
                } else {
                    console.error('Failed to add');
                }
            } catch (error) {
                setError('An error occurred. Please try again.');
                console.error(error);
            }
        } else {
            alert("User not authenticated");
        }
    };

    return (
        <div className="availability-container">
            <h2>SetAvailability</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>StartDate:</label>
                    <input
                        type="date"
                        name="StartDate"
                        value={availabilityDetails.StartDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>EndtDate:</label>
                    <input
                        type="date"
                        name="EndDate"
                        value={availabilityDetails.EndDate}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Add availability</button>
            </form>
        </div>
    );
};

export default AvailabilityForm;