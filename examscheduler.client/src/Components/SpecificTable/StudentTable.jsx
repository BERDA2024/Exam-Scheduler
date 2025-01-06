import React, { useState, useEffect } from "react";
import { getAuthHeader } from '../../Utils/AuthUtils';
import '../GenericTable/GenericTable.css';

const StudentTable = ({ students, onEdit }) => {
    const [subgroups, setSubgroups] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [originalStudent, setOriginalStudent] = useState(null);
    const authHeader = getAuthHeader();

    // Fetch subgroups when edit is pressed
    const fetchSubgroups = async () => {
        const response = await fetch("https://localhost:7118/api/Subgroup", {
            headers: {
                ...authHeader
            }
        });
        if (response.ok) {
            const data = await response.json();
            setSubgroups(data);
        }
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setOriginalStudent(student); // Save original student data for canceling
        fetchSubgroups(); // Fetch subgroups when editing
    };

    const handleCancel = () => {
        setSelectedStudent(null); // Close the edit form
        setOriginalStudent(null); // Clear original student data
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`https://localhost:7118/api/Student/${selectedStudent.id}`, {
                method: 'PUT',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: selectedStudent.id,
                    FullName: selectedStudent.fullName,
                    Email: selectedStudent.email,
                    FullGroupName: selectedStudent.fullGroupName, // Make sure to update FullGroupName
                }),
            });

            if (response.ok) {
                // After saving, refresh the student list
                onEdit(); // Call the method to fetch the updated students
                setSelectedStudent(null); // Close the edit form
                setOriginalStudent(null); // Clear original student data
            } else {
                console.error('Failed to save student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    return (
        <table className="generic-table">
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Subgroup</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <tr key={student.id}>
                        <td>{student.fullName}</td>
                        <td>{student.email}</td>
                        <td>
                            {selectedStudent?.id === student.id ? (
                                <select
                                    value={selectedStudent.fullGroupName || ""}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, fullGroupName: e.target.value })}
                                >
                                    <option value="">Select Subgroup</option>
                                    {subgroups.map((subgroup) => (
                                        <option key={subgroup.id} value={subgroup.fullName}>
                                            {subgroup.fullName}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                student.fullGroupName
                            )}
                        </td>
                        {selectedStudent?.id === student.id ?
                            (<td className="controls">

                                {<button
                                    className="generic-management-button"
                                    onClick={handleSave}
                                >Save</button>}
                                {<button
                                    className="generic-management-button"
                                    onClick={handleCancel}
                                >Cancel</button>}
                            </td>
                            ) : (
                                <td className="controls">
                                    {<button
                                        className="generic-management-button"
                                        onClick={() => handleEdit(student)}
                                    >Edit</button>}
                                </td>
                            )
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StudentTable;