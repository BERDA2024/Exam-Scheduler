import React, { useState, useEffect } from "react";
import "./EditSubjectsForm.css";
import { getAuthHeader } from "../../Utils/AuthUtils"; // Import pentru antet de autentificare

const EditSubjectsForm = () => {
    const [scheduleRequests, setScheduleRequests] = useState([]);
    const [editRequest, setEditRequest] = useState(null);
    const [error, setError] = useState(null);
    const [classrooms, setClassrooms] = useState([]); // Lista de săli din backend
    const [filteredClassrooms, setFilteredClassrooms] = useState([]); // Săli filtrate pe măsură ce scrii
    const [classroomSearch, setClassroomSearch] = useState(""); // Căutare sală
    const authHeader = getAuthHeader(); // Obține antetul pentru autentificare

    // Fetch toate cererile de programare
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

            // Filtrează cererile pentru a include doar cele cu RequestStateID === 2
            const acceptedRequests = data.filter((req) => req.requestStateID === 2);
            setScheduleRequests(acceptedRequests);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch schedule requests.");
        }
    };

    // Fetch sălile din backend
    const fetchClassrooms = async () => {
        try {
            const response = await fetch("https://localhost:7118/api/Classroom", {
                method: "GET",
                headers: authHeader,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch classrooms.");
            }

            const data = await response.json();
            setClassrooms(data); // Salvează lista de săli
        } catch (error) {
            console.error(error);
            setError("Failed to fetch classrooms.");
        }
    };

    // Funcție de căutare a sălilor în dropdown
    const handleClassroomSearch = (e) => {
        const searchValue = e.target.value;
        setClassroomSearch(searchValue);

        if (searchValue === "") {
            setFilteredClassrooms([]); // Dacă nu se scrie nimic, ascundem lista
        } else {
            // Filtrarea sălilor pe baza textului căutat
            const filtered = classrooms.filter((classroom) =>
                classroom.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredClassrooms(filtered);
        }
    };

    // Funcție pentru a iniția editarea unei cereri
    const handleEdit = (request) => {
        setEditRequest({
            id: request.id,
            startDate: request.startDate || "", // Default pentru data
            classroomName: request.classroomName || "", // Default pentru sală
        });
    };

    // Salvează modificările
    const handleSave = async () => {
        if (!editRequest) return;

        const originalRequest = scheduleRequests.find((req) => req.id === editRequest.id);
        if (!originalRequest) {
            setError("Original request not found.");
            return;
        }

        try {
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
                        startDate: editRequest.startDate,
                        classroomName: editRequest.classroomName,
                        studentID: originalRequest.studentID,
                        requestStateID: originalRequest.requestStateID,
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

    // Gestionare modificări ale câmpurilor formularului
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditRequest({ ...editRequest, [name]: value });
    };

    // Fetch cererile și sălile la încărcarea componentului
    useEffect(() => {
        fetchScheduleRequests();
        fetchClassrooms();
    }, []);

    return (
        <div>
            <h3>Edit Exam Schedule</h3>
            {error && <p className="error-message">{error}</p>}
            {scheduleRequests.length === 0 ? (
                <p>No accepted exams available.</p>
            ) : (
                <ul>
                    {scheduleRequests.map((request) => (
                        <li key={request.id}>
                            {editRequest?.id === request.id ? (
                                <div className="edit-form">
                                    <label>
                                        Date:
                                        <input
                                            type="datetime-local"
                                            name="startDate"
                                            value={editRequest.startDate || ""}
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <label>
                                        Classroom:
                                        <input
                                            type="text"
                                            value={classroomSearch}
                                            onChange={handleClassroomSearch}
                                            placeholder="Start typing to search for a classroom..."
                                        />
                                        {/* Dropdown care se deschide doar dacă există text introdus */}
                                        {filteredClassrooms.length > 0 && classroomSearch && (
                                            <ul className="dropdown-list">
                                                {filteredClassrooms.map((classroom) => (
                                                    <li
                                                        key={classroom.id}
                                                        onClick={() => {
                                                            setClassroomSearch(classroom.name);
                                                            setEditRequest({
                                                                ...editRequest,
                                                                classroomName: classroom.name,
                                                            });
                                                            setFilteredClassrooms([]); // Ascunde lista după selecție
                                                        }}
                                                    >
                                                        {classroom.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </label>
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={() => setEditRequest(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div className="schedule-details">
                                    <span>
                                        {request.subjectName} -{" "}
                                        {request.startDate
                                            ? new Date(request.startDate).toLocaleString("ro-RO")
                                            : "No date set"}{" "}
                                        in {request.classroomName || "Unknown"}
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
