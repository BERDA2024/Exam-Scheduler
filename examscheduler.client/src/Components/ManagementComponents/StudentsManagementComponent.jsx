import React, { useEffect, useState } from "react";
import { getAuthHeader } from '../../Utils/AuthUtils';
import StudentTable from '../SpecificTable/StudentTable';
import "./ManagementComponent.css";

const StudentsManagementComponent = () => {
    const [students, setStudents] = useState([]);
    const [nameSearch, setNameSearch] = useState("");
    const [groupSearch, setGroupSearch] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [error, setError] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]); // Holds the filtered faculties
    const authHeader = getAuthHeader();

    const fetchStudents = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/Student", {
                    headers: {
                        ...authHeader
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                    setFilteredStudents(data); // Initialize the filtered list with all users
                } else {
                    console.error('Failed to get students');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleEdit = () => {
        fetchStudents(); // Fetch students again after an edit
    };

    const handleNameSearchChange = (e) => setNameSearch(e.target.value);
    const handleEmailSearchChange = (e) => setEmailSearch(e.target.value);
    const handleGroupSearchChange = (e) => setGroupSearch(e.target.value);

    const handleSearch = () => {
        const filtered = students.filter(
            (student) =>
                student &&
                student.fullName.toLowerCase().includes(!nameSearch ? '' : nameSearch.toLowerCase()) &&
                student.email.toLowerCase().includes(!emailSearch ? '' : emailSearch.toLowerCase()) &&
                student.fullGroupName.toLowerCase().includes(!groupSearch ? '' : groupSearch.toLowerCase())
        );
        setFilteredStudents(filtered);
    };

    return (
        <div>
            <div className="data-management">
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={nameSearch}
                        onChange={handleNameSearchChange}
                    />
                    <input
                        type="text"
                        placeholder="Search by email"
                        value={emailSearch}
                        onChange={handleEmailSearchChange}
                    />
                    <input
                        type="text"
                        placeholder="Search by group"
                        value={groupSearch}
                        onChange={handleGroupSearchChange}
                    />
                    <button className="data-management-button" onClick={handleSearch}>Search</button>
                </div>

                <StudentTable students={filteredStudents} onEdit={handleEdit} />
            </div>
        </div>
    );
};

export default StudentsManagementComponent;