import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleExam = () => {
    const [examDetails, setExamDetails] = useState({ Subject: '', Classroom: '', StartDate: ''});

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExamDetails((examDetails) => ({
            ...examDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Subject: examDetails.Subject,
                    Classroom: examDetails.Classroom,
                    StartDate: examDetails.StartData
                }),
            });


        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="schedule-exam-container">
            <h2>Schedule Exam</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Subject:</label>
                    <input
                        type="string"
                        name="Subject"
                        value={examDetails.Subject}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>StartDate:</label>
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
                        type="string"
                        name="Classroom"
                        value={examDetails.Classroom}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Schedule Exam</button>
            </form>
        </div>
    );
};

export default ScheduleExam;
