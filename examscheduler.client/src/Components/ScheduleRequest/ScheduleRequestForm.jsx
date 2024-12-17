import React, { useState, useEffect } from 'react';
import './ScheduleRequestForm.css';
import { getAuthHeader } from '../../Utils/AuthUtils';

const ScheduleRequestForm = () => {
    const [examDetails, setExamDetails] = useState({
        Subject: '',
        StartDate: '',
        Classroom: ''
    });
    const [scheduledExams, setScheduledExams] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const authHeader = getAuthHeader();

    // Fetch scheduled exams on load
    useEffect(() => {
        fetchScheduledExams();
    }, []);

    const fetchScheduledExams = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'GET',
                headers: authHeader
            });

            if (response.ok) {
                const data = await response.json();
                setScheduledExams(data);
                console.log(data);
                console.log(scheduledExams);
            } else {
                setError('Failed to fetch scheduled exams.');
            }
        } catch (err) {
            setError('An error occurred while fetching scheduled exams.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExamDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!examDetails.Subject || !examDetails.StartDate || !examDetails.Classroom) {
            setError('All fields are required.');
            return;
        }

        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'POST',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    SubjectName: examDetails.Subject,
                    StartDate: examDetails.StartDate,
                    ClassroomName: examDetails.Classroom
                })
            });

            if (response.ok) {
                const newExam = await response.json();
                setScheduledExams((prev) => [...prev, newExam]);
                setSuccessMessage('Exam scheduled successfully!');
                setExamDetails({ Subject: '', StartDate: '', Classroom: '' });
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to schedule exam.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="schedule-exam-page">
            <h1>Schedule Exam</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Subject:</label>
                    <input
                        type="text"
                        name="Subject"
                        value={examDetails.Subject}
                        onChange={handleInputChange}
                        placeholder="Enter subject name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Start Date and Time:</label>
                    <input
                        type="datetime-local"
                        name="StartDate"
                        value={examDetails.StartDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Classroom:</label>
                    <input
                        type="text"
                        name="Classroom"
                        value={examDetails.Classroom}
                        onChange={handleInputChange}
                        placeholder="Enter classroom name"
                        required
                    />
                </div>
                <button type="submit">Request Schedule</button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

        </div>
    );
};

export default ScheduleRequestForm;