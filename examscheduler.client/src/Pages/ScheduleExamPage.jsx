import React, { useState, useEffect } from 'react';
import { getAuthHeader } from '../Utils/AuthUtils';

const ScheduleExamPage = () => {
    const [examDetails, setExamDetails] = useState({ Subject: '', Classroom: '', StartDate: '' });
    const [scheduledExams, setScheduledExams] = useState([]); // Lista de examene salvate
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const authHeader = getAuthHeader();

    useEffect(() => {
        const fetchScheduledExams = async () => {
            try {
                const response = await fetch('https://localhost:7118/api/ScheduleRequest');
                if (response.ok) {
                    const data = await response.json();
                    setScheduledExams(data);
                } else {
                    throw new Error('Failed to fetch exams');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchScheduledExams();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExamDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!examDetails.Subject || !examDetails.Classroom || !examDetails.StartDate) {
            setError('All fields are required.');
            setSuccessMessage('');
            return;
        }

        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'POST',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(examDetails),
            });

            if (response.ok) {
                const newExam = await response.json();
                setScheduledExams((prev) => [...prev, newExam]); // Adăugăm examenul nou la listă
                setSuccessMessage('Exam scheduled successfully!');
                setError('');
                setExamDetails({ Subject: '', Classroom: '', StartDate: '' }); // Resetăm formularul
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to schedule exam');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error(error);
            setError('An unexpected error occurred. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="schedule-exam-container">
            <h2>Schedule Exam</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Subject:</label>
                    <input
                        type="text"
                        name="Subject"
                        value={examDetails.Subject}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="StartDate"
                        value={examDetails.StartDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Classroom:</label>
                    <input
                        type="text"
                        name="Classroom"
                        value={examDetails.Classroom}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Schedule Exam</button>
            </form>

            <div className="scheduled-exams">
                <h3>Your Scheduled Exams</h3>
                <ul>
                    {scheduledExams.map((exam, index) => (
                        <li key={index}>
                            {exam.Subject} - {exam.StartDate} - {exam.Classroom}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ScheduleExamPage;
