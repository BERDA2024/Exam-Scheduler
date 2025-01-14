import React, { useEffect, useState } from 'react';
import './ProfessorManagementForm.css';
import { getAuthHeader } from '../../Utils/AuthUtils';

const ProfessorManagementForm = () => {
    const [subjects, setSubjects] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [scheduleRequests, setScheduleRequests] = useState([]);

    const authHeader = getAuthHeader();

    const [newAvailability, setNewAvailability] = useState({ startDate: '', endDate: '' });
    const [newScheduleRequest, setNewScheduleRequest] = useState({
        subjectName: '',
        studentID: '',
        classroomName: '',
        startDate: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSubjects();
        fetchAvailabilities();
        fetchScheduleRequests();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/Subject', {
                method: 'GET',
                headers: authHeader,
            });
            if (!response.ok) throw new Error('Failed to fetch subjects');
            const data = await response.json();
            setSubjects(data);
        } catch (error) {
            setError('Failed to fetch subjects. Please try again.');
            console.error('Error fetching subjects:', error);
        }
    };

    const fetchAvailabilities = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/Availability', {
                method: 'GET',
                headers: authHeader,
            });
            if (!response.ok) throw new Error('Failed to fetch availabilities');
            const data = await response.json();
            setAvailabilities(data);
        } catch (error) {
            setError('Failed to fetch availabilities. Please try again.');
            console.error('Error fetching availabilities:', error);
        }
    };

    const fetchScheduleRequests = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest/Professor', {
                method: 'GET',
                headers: authHeader,
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to fetch schedule requests');
            }
            const data = await response.json();
            setScheduleRequests(data);
        } catch (error) {
            setError('Failed to fetch schedule requests. Please try again.');
            console.error('Error fetching schedule requests:', error);
        }
    };

    const handleNewAvailabilityChange = (e) => {
        const { name, value } = e.target;
        setNewAvailability({ ...newAvailability, [name]: value });
    };

    const handleAddAvailability = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7118/api/Availability', {
                method: 'POST',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAvailability),
            });
            if (!response.ok) throw new Error('Failed to add availability');
            const data = await response.json();
            setAvailabilities([...availabilities, data]);
            setNewAvailability({ startDate: '', endDate: '' });
            setSuccess('Availability added successfully!');
            setError('');
        } catch (error) {
            setError('Failed to add availability. Please check the input.');
            setSuccess('');
        }
    };

    const handleNewScheduleRequestChange = (e) => {
        const { name, value } = e.target;
        setNewScheduleRequest({ ...newScheduleRequest, [name]: value });
    };

    const handleAddScheduleRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'POST',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newScheduleRequest),
            });
            if (!response.ok) throw new Error('Failed to add schedule request');
            const data = await response.json();
            setScheduleRequests([...scheduleRequests, data]);
            setNewScheduleRequest({
                subjectName: '',
                studentID: '',
                classroomName: '',
                startDate: '',
            });
            setSuccess('Schedule request added successfully!');
            setError('');
        } catch (error) {
            setError('Failed to add schedule request. Please check the input.');
            setSuccess('');
        }
    };

    return (
        <div className="professor-management-container">
            <h2>Professor Management</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="subject-list">
                <h3>Subjects</h3>
                {subjects.length > 0 ? (
                    subjects.map((subject) => (
                        <div key={subject.id} className="subject-item">
                            <p><strong>{subject.longName}</strong> ({subject.shortName})</p>
                            <p>Professor ID: {subject.professorID}</p>
                            <p>Department ID: {subject.departmentId}</p>
                            <p>Exam Duration: {subject.examDuration} minutes</p>
                            <p>Exam Type: {subject.examType}</p>
                        </div>
                    ))
                ) : (
                    <p>No subjects available.</p>
                )}
            </div>

            <form className="availability-form" onSubmit={handleAddAvailability}>
                <h3>Add Availability</h3>
                <input
                    type="datetime-local"
                    name="startDate"
                    value={newAvailability.startDate}
                    onChange={handleNewAvailabilityChange}
                    required
                />
                <input
                    type="datetime-local"
                    name="endDate"
                    value={newAvailability.endDate}
                    onChange={handleNewAvailabilityChange}
                    required
                />
                <button type="submit">Add Availability</button>
            </form>
            <div className="availability-list">
                <h3>Availabilities</h3>
                {availabilities.length > 0 ? (
                    availabilities.map((availability) => (
                        <div key={availability.id} className="availability-item">
                            <p>
                                From: {new Date(availability.startDate).toLocaleString()} - To: {new Date(availability.endDate).toLocaleString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No availabilities available.</p>
                )}
            </div>

            <form className="schedule-request-form" onSubmit={handleAddScheduleRequest}>
                <h3>Add Schedule Request</h3>
                <input
                    type="text"
                    name="subjectName"
                    placeholder="Subject Name"
                    value={newScheduleRequest.subjectName}
                    onChange={handleNewScheduleRequestChange}
                    required
                />
                <input
                    type="text"
                    name="studentID"
                    placeholder="Student ID"
                    value={newScheduleRequest.studentID}
                    onChange={handleNewScheduleRequestChange}
                    required
                />
                <input
                    type="text"
                    name="classroomName"
                    placeholder="Classroom Name"
                    value={newScheduleRequest.classroomName}
                    onChange={handleNewScheduleRequestChange}
                    required
                />
                <input
                    type="datetime-local"
                    name="startDate"
                    value={newScheduleRequest.startDate}
                    onChange={handleNewScheduleRequestChange}
                    required
                />
                <button type="submit">Add Schedule Request</button>
            </form>
            <div className="schedule-request-list">
                <h3>Schedule Requests</h3>
                {scheduleRequests.length > 0 ? (
                    scheduleRequests.map((request) => (
                        <div key={request.id} className="schedule-request-item">
                            <p><strong>Subject:</strong> {request.subjectName}</p>
                            <p><strong>Student ID:</strong> {request.studentID}</p>
                            <p><strong>Classroom:</strong> {request.classroomName}</p>
                            <p><strong>Date:</strong> {new Date(request.startDate).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No schedule requests available for your subjects.</p>
                )}
            </div>
        </div>
    );
};

export default ProfessorManagementForm;
