import React, { useState, useEffect } from 'react';
import './ScheduleRequestForm.css';
import { getAuthHeader } from '../../Utils/AuthUtils';

const ScheduleRequestForm = () => {
    const [examDetails, setExamDetails] = useState({
        Subject: '',
        StartDate: '',
        StartDateMin: '',
        StartDateMax: '',
        Classroom: '',
    });

    const [scheduledExams, setScheduledExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [filteredClassrooms, setFilteredClassrooms] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const authHeader = getAuthHeader();

    useEffect(() => {
        fetchScheduledExams();
        fetchSubjects();
        fetchClassrooms();
    }, []);

    const fetchScheduledExams = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'GET',
                headers: authHeader,
            });

            if (response.ok) {
                const data = await response.json();
                setScheduledExams(data);
            } else {
                throw new Error('Failed to fetch scheduled exams');
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/Subject', {
                method: 'GET',
                headers: authHeader,
            });

            if (response.ok) {
                const data = await response.json();
                setSubjects(data);
            } else {
                throw new Error('Failed to fetch subjects');
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const fetchClassrooms = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/Classroom', {
                method: 'GET',
                headers: authHeader,
            });

            if (response.ok) {
                const data = await response.json();
                setClassrooms(data);
            } else {
                throw new Error('Failed to fetch classrooms');
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const fetchAvailabilityForSubject = async (subjectName) => {
        try {
            const response = await fetch(`https://localhost:7118/api/Availability/availability-by-subject?subjectName=${subjectName}`, {
                method: 'GET',
                headers: authHeader,
            });

            if (response.ok) {
                const data = await response.json();
                return data; // Returnează toate intervalele de disponibilitate
            } else {
                console.error('Failed to fetch availability');
            }
        } catch (err) {
            console.error('Error fetching availability:', err);
        }

        return null;
    };

    const checkClassroomAvailability = async (classroomId, startDate) => {
        try {
            const response = await fetch(
                `https://localhost:7118/api/Classroom/check-availability?classroomId=${classroomId}&examStartDate=${startDate}&examDuration=90`,
                {
                    method: 'GET',
                    headers: authHeader,
                }
            );

            if (response.status === 409) {
                const data = await response.json();
                setError(data.message);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error checking classroom availability:', err);
            setError('An unexpected error occurred while checking classroom availability.');
            return false;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'Classroom') {
            setShowSuggestions(true);
            const filtered = classrooms.filter((classroom) =>
                classroom.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredClassrooms(filtered);
        }

        setExamDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = async (e) => {
        const subjectName = e.target.value;
        setExamDetails((prev) => ({ ...prev, Subject: subjectName }));

        const availability = await fetchAvailabilityForSubject(subjectName);

        if (availability && availability.length > 0) {
            const firstAvailability = availability[0]; // Poți folosi primul interval sau le poți combina
            setExamDetails((prev) => ({
                ...prev,
                StartDateMin: firstAvailability.startDate,
                StartDateMax: firstAvailability.endDate,
            }));
        } else {
            setExamDetails((prev) => ({
                ...prev,
                StartDateMin: '',
                StartDateMax: '',
            }));
            setError('No availability found for the professor of this subject.');
        }
    };

    const handleSuggestionClick = (classroomName) => {
        setExamDetails((prev) => ({ ...prev, Classroom: classroomName }));
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!examDetails.Subject || !examDetails.StartDate || !examDetails.Classroom) {
            setError('All fields are required.');
            return;
        }

        setError('');
        setSuccessMessage('');

        const selectedClassroom = classrooms.find(
            (classroom) => classroom.name === examDetails.Classroom
        );

        if (!selectedClassroom) {
            setError('Invalid classroom selected.');
            return;
        }

        const isAvailable = await checkClassroomAvailability(
            selectedClassroom.id,
            examDetails.StartDate
        );

        if (!isAvailable) {
            return;
        }

        // Set default values for fields not provided by the frontend
        const scheduleRequestData = {
            SubjectName: examDetails.Subject,
            StartDate: examDetails.StartDate,
            ClassroomName: examDetails.Classroom,
            ExamDuration: 90, // Default duration
            ExamType: 'NULL', // Default exam type
            RejectionReason: null, // Default rejection reason
            StudentID: 1, // Assume StudentID is 1 or fetch it from auth
            RequestStateID: 1, // Default request state (pending)
        };

        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'POST',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleRequestData),
            });

            if (response.ok) {
                const newExam = await response.json();
                setScheduledExams((prev) => [...prev, newExam]);
                setSuccessMessage('Exam scheduled successfully!');
                setExamDetails({
                    Subject: '',
                    StartDate: '',
                    StartDateMin: '',
                    StartDateMax: '',
                    Classroom: '',
                });
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
                    <select
                        name="Subject"
                        value={examDetails.Subject}
                        onChange={handleSubjectChange}
                        required
                    >
                        <option value="" disabled>Select a subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.longName}>
                                {subject.longName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Start Date and Time:</label>
                    <input
                        type="datetime-local"
                        name="StartDate"
                        value={examDetails.StartDate}
                        onChange={handleInputChange}
                        min={examDetails.StartDateMin}
                        max={examDetails.StartDateMax}
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
                        onFocus={() => setShowSuggestions(true)}
                        required
                    />
                    {showSuggestions && filteredClassrooms.length > 0 && (
                        <ul className="suggestions-list">
                            {filteredClassrooms.map((classroom) => (
                                <li
                                    key={classroom.id}
                                    onClick={() => handleSuggestionClick(classroom.name)}
                                >
                                    {classroom.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button type="submit">Request Schedule</button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default ScheduleRequestForm;
