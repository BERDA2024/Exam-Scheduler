﻿import React, { useState, useEffect } from "react";
import "./EditSubjectsForm.css";
import { getAuthHeader } from "../../Utils/AuthUtils";

const EditSubjectsForm = () => {
    const [scheduleRequests, setScheduleRequests] = useState([]);
    const [editRequest, setEditRequest] = useState(null);
    const [error, setError] = useState(null);
    const authHeader = getAuthHeader();

    const examTypes = ["Colocviu", "Oral", "Scris", "Moodle"];

    const fetchScheduleRequests = async () => {
        try {
            const response = await fetch(
                "https://localhost:7118/api/ScheduleRequest",
                {
                    method: "GET",
                    headers: authHeader,
                }
            );

            if (!response.ok) throw new Error("Failed to fetch schedule requests");

            const data = await response.json();
            const acceptedRequests = data.filter((req) => req.requestStateID === 2);
            setScheduleRequests(acceptedRequests);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch schedule requests.");
        }
    };

    const handleEdit = (request) => {
        setEditRequest({
            id: request.id,
            examType: request.examType || "Colocviu",
            examDuration: request.examDuration || 60,
            startDate: request.startDate
                ? new Date(request.startDate).toISOString().split("T")[0]
                : "",
            startTime: request.startDate
                ? new Date(request.startDate).toISOString().split("T")[1].slice(0, 5)
                : "00:00",
        });
    };

    const handleSave = async () => {
        if (!editRequest) return;

        const isValidDate = new Date(editRequest.startDate).toString() !== "Invalid Date";
        if (!isValidDate) {
            setError("Invalid date format");
            return;
        }

        const originalRequest = scheduleRequests.find((req) => req.id === editRequest.id);
        if (!originalRequest) {
            setError("Original request not found.");
            return;
        }

        try {
            // Construcție manuală a datei și orei fără offset
            const combinedDateTime = `${editRequest.startDate}T${editRequest.startTime}:00`;

            const response = await fetch(
                `https://localhost:7118/api/ScheduleRequest/${editRequest.id}`,
                {
                    method: "PUT",
                    headers: {
                        ...authHeader,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: editRequest.id,
                        examType: editRequest.examType,
                        examDuration: editRequest.examDuration,
                        studentID: originalRequest.studentID,
                        requestStateID: originalRequest.requestStateID,
                        startDate: combinedDateTime, // Data corectă
                    }),
                }
            );

            if (response.ok) {
                await fetchScheduleRequests();
                setEditRequest(null);
            } else {
                const errorText = await response.text();
                console.error("Update failed:", errorText);
                setError("Failed to update schedule request.");
            }
        } catch (error) {
            console.error("Error during update:", error);
            setError("Failed to update schedule request.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditRequest({ ...editRequest, [name]: value });
    };

    useEffect(() => {
        fetchScheduleRequests();
    }, []);

    return (
        <div>
            <h3>Edit Exam Details</h3>
            {error && <p className="error-message">{error}</p>}
            {scheduleRequests.length === 0 ? (
                <p>No accepted exams available.</p>
            ) : (
                <ul>
                    {scheduleRequests
                        .slice()
                        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                        .reverse()
                        .map((request) => (
                            <li key={request.id}>
                                {editRequest?.id === request.id ? (
                                    <div className="edit-form">
                                        <label>
                                            Exam Type:
                                            <select
                                                name="examType"
                                                value={editRequest.examType}
                                                onChange={handleChange}
                                            >
                                                {examTypes.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Exam Duration (minutes):
                                            <input
                                                type="number"
                                                name="examDuration"
                                                value={editRequest.examDuration}
                                                onChange={handleChange}
                                                min="10"
                                                max="300"
                                            />
                                        </label>
                                        <label>
                                            Start Date:
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={editRequest.startDate}
                                                onChange={handleChange}
                                            />
                                        </label>
                                        <label>
                                            Start Time:
                                            <input
                                                type="time"
                                                name="startTime"
                                                value={editRequest.startTime}
                                                onChange={handleChange}
                                            />
                                        </label>
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={() => setEditRequest(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <div className="schedule-details">
                                        <span>
                                            {request.subjectName} - Type: {request.examType || "N/A"}, Duration:{" "}
                                            {request.examDuration || "N/A"} minutes, Date:{" "}
                                            {new Date(request.startDate).toLocaleString()}
                                        </span>
                                        <button onClick={() => handleEdit(request)}>Edit</button>
                                    </div>
                                )}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default EditSubjectsForm;
