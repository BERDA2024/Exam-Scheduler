import React, { useState } from 'react';

const AvailabilityPage = () => {
    const [availabilityDetails, setAvailabilityDetails] = useState({ StartDate: '', EndDate: '' });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAvailabilityDetails((availabilityDetails) => ({
            ...availabilityDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');

        if (!token) {
            console.log("Not connected");
            return;
        }

        try {
            const response = await fetch('https://localhost:7118/api/Availability', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Send the token with the request
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    StartDate: availabilityDetails.StartDate,
                    EndDate: availabilityDetails.EndDate
                }),
            });

            const text = await response.text();  // Get raw response text
            //console.log(text);  // Log raw response for inspection

            let result;
            try {
                result = JSON.parse(text);  // Attempt to parse it as JSON
                console.log(result);
            } catch (e) {
                //console.error("Failed to parse response as JSON:", e);
                setError("Invalid server response.");
                return;
            }
            if (response.ok) {
                console.log('Added availability.');
            } else {
                console.error('Failed to add');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
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

export default AvailabilityPage;