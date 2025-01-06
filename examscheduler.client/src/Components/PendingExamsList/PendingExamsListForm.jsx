import React, { useState, useEffect } from 'react';
import './PendingExamsListForm.css';
import { getAuthHeader } from '../../Utils/AuthUtils';

const PendingExamsListForm = () => {
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

                // Filtrăm examenele cu RequestStateID = 3 (pentru examenele respinse)
                const filteredExams = data.filter((exam) => exam.requestStateID === 1);

                // Verificăm dacă lista de examene este deja actualizată
                if (filteredExams.length > 0 && filteredExams.length !== scheduledExams.length) {
                    setScheduledExams(filteredExams); // Setăm lista cu examenele noi
                }
                console.log(filteredExams);
            } else {
                setError('Failed to fetch scheduled exams.');
            }
        } catch (err) {
            setError('An error occurred while fetching scheduled exams.');
        }
    };

    return (
        <div>
            <h1>Your Pending Scheduled Exams</h1>
            <div className="scheduled-exams">
                {error && <p className="error-message">{error}</p>}
                {scheduledExams.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Start Date</th>
                                <th>Classroom</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduledExams.map((exam) => (
                                <tr key={exam.id}>
                                    <td>{exam.subjectName || 'Unknown'}</td>
                                    <td>{new Date(exam.startDate).toLocaleString()}</td>
                                    <td>{exam.classroomName || 'Unknown'}</td>
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

export default PendingExamsListForm;
