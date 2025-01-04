import React, { useState, useEffect } from 'react';
import './ManageScheduleRequestsForm.css';
import { getAuthHeader } from '../../Utils/AuthUtils'; // Importă funcția getAuthHeader

const ManageScheduleRequestsForm = () => {
    const [scheduleRequests, setScheduleRequests] = useState([]);
    const [error, setError] = useState(null);
    const authHeader = getAuthHeader();

    // Fetch schedule requests
    const fetchScheduleRequests = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'GET',
                headers: authHeader,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch schedule requests.');
            }

            const data = await response.json();
            setScheduleRequests(data);
        } catch (error) {
            console.error('Error fetching schedule requests:', error);
            setError('An error occurred while fetching schedule requests.');
        }
    };

    // Update request state (approve or reject)
    const updateRequestState = async (id, requestStateID) => {
        try {
            const requestToUpdate = scheduleRequests.find((req) => req.id === id);

            if (!requestToUpdate) {
                throw new Error('Request not found.');
            }

            const updatedRequest = {
                ...requestToUpdate,
                requestStateID, // Update state
            };

            const response = await fetch(`https://localhost:7118/api/ScheduleRequest/${id}`, {
                method: 'PUT',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRequest),
            });

            if (!response.ok) {
                throw new Error('Failed to update request state.');
            }

            // Reload the schedule requests after updating
            fetchScheduleRequests();
        } catch (error) {
            console.error('Error updating request state:', error);
            setError('An error occurred while updating the request state.');
        }
    };

    useEffect(() => {
        fetchScheduleRequests();
    }, []);

    return (
        <div className="card">
            <h3>Schedule Requests</h3>
            {error && <p className="error-message">{error}</p>}
            <ul>
                {scheduleRequests.map((request) => (
                    <li key={request.id}>
                        <p>
                            <strong>Subject:</strong> {request.subjectName} <br />
                            <strong>Student:</strong> {request.studentID} <br />
                            <strong>Date:</strong> {new Date(request.startDate).toLocaleString()} <br />
                            <strong>Classroom:</strong> {request.classroomName} <br />
                            <strong>Status:</strong>{' '}
                            {request.requestStateID === 1
                                ? 'Pending'
                                : request.requestStateID === 2
                                    ? 'Approved'
                                    : 'Rejected'}
                        </p>
                        <div className="buttons">
                            <button
                                onClick={() => updateRequestState(request.id, 2)}
                                className="approve"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => updateRequestState(request.id, 3)}
                                className="reject"
                            >
                                Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default ManageScheduleRequestsForm;
