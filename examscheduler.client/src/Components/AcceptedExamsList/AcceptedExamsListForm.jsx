﻿import React, { useState, useEffect } from 'react';
import './AcceptedExamsListForm.css';
import { getAuthHeader } from '../../Utils/AuthUtils';

const AcceptedExamsListForm = () => {
    const [scheduledExams, setScheduledExams] = useState([]);
    const [error, setError] = useState(null);
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

                // Filtrăm examenele acceptate (requestStateID === 2)
                const filteredExams = data.filter((exam) => exam.requestStateID === 2);

                // Sortăm examenele după data de început
                const sortedExams = filteredExams.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

                setScheduledExams(sortedExams);
                console.log(sortedExams);
            } else {
                setError('Failed to fetch scheduled exams.');
            }
        } catch (err) {
            setError('An error occurred while fetching scheduled exams.');
        }
    };

    return (
        <div>
            <h1>Your Accepted Scheduled Exams</h1>
            <div className="scheduled-exams">
                {error && <p className="error-message">{error}</p>}
                {scheduledExams.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Start Date</th>
                                <th>Classroom</th>
                                <th>Duration</th>
                                <th>Exam Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduledExams.map((exam) => (
                                <tr key={exam.id}>
                                    <td>{exam.subjectName || 'Unknown'}</td>
                                    <td>{new Date(exam.startDate).toLocaleString()}</td>
                                    <td>{exam.classroomName || 'Unknown'}</td>
                                    <td>{exam.examDuration ? `${exam.examDuration} minutes` : 'Unknown'}</td>
                                    <td>{exam.examType || 'Unknown'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No exams scheduled yet.</p>
                )}
            </div>
        </div>
    );
};

export default AcceptedExamsListForm;
