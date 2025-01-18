import React, { useEffect, useState } from 'react';
import { getAuthHeader } from '../../Utils/AuthUtils'; // Asigură-te că ai funcția pentru token
import './AddAvailabilityForm.css';

const AddAvailabilityForm = () => {
    const [availability, setAvailability] = useState({ startDate: '', endDate: '' });
    const [availabilities, setAvailabilities] = useState([]); // Stocăm disponibilitățile existente
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchAvailabilities(); // Obține disponibilitățile la încărcarea componentei
    }, []);

    const fetchAvailabilities = async () => {
        try {
            const authHeader = getAuthHeader();
            const response = await fetch('https://localhost:7118/api/Availability', {
                method: 'GET',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch availabilities');
            }

            const data = await response.json();
            setAvailabilities(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAvailability({ ...availability, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const authHeader = getAuthHeader();
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

            setSuccess(true);
            setAvailability({ startDate: '', endDate: '' }); // Resetează formularul
            fetchAvailabilities(); // Actualizează lista de disponibilități
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="availability-container">
            <h3>Add Availability</h3>
            <form onSubmit={handleSubmit} className="availability-form">
                {error && <p className="error-message">Error: {error}</p>}
                {success && <p className="success-message">Availability added successfully!</p>}
                <label>
                    Start Date:
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={availability.startDate}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={availability.endDate}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Add Availability</button>
            </form>

            <h3>Existing Availabilities</h3>
            {availabilities.length > 0 ? (
                <table className="availability-table">
                    <thead>
                        <tr>
                            <th>Start Date</th>
                            <th>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availabilities.map((item) => (
                            <tr key={item.id}>
                                <td>{new Date(item.startDate).toLocaleString()}</td>
                                <td>{new Date(item.endDate).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No availabilities found.</p>
            )}
        </div>
    );
};

export default AddAvailabilityForm;
