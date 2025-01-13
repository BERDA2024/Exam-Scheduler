import React, { useState, useEffect } from "react";
import { getAuthHeader } from '../../Utils/AuthUtils';
import GenericTable from "../GenericTable/GenericTable";
import SubjectForm from '../../Forms/SubjectForm';
import DepartmentSelector from '../../Utils/DepartmentSelector';
import "./ManagementComponent.css";

const SubjectsManagementComponent = () => {
    const [subjects, setSubjects] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null); // For editing
    const [filterDepartment, setFilterDepartment] = useState("");
    const [error, setError] = useState('');
    const [filteredSubject, setFilteredSubject] = useState([]);
    const authHeader = getAuthHeader();

    const fetchGroups = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/Subject/add", {
                    headers: {
                        ...authHeader
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSubjects(data);
                    setFilteredSubject(data); // Initialize the filtered list with all groups
                } else {
                    console.error('Failed to get groups');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleDepartmentFilterChange = (e) => setFilterDepartment(e.target.value);

    const handleSearch = () => {
        const filtered = subjects.filter(
            (subject) =>
                subject &&
                subject.shortName.toLowerCase().includes(!search ? '' : search.toLowerCase()) &&
                (filterDepartment === "" || (filterDepartment != "" && filterDepartment === subject.departmentShortName))
        );
        setFilteredSubject(filtered);
    };

    const handleAddSubject = () => {
        setSelectedSubject(null); // Clear selection for new faculty
        setShowForm(true);
    };

    const handleEditSubject = (subject) => {
        setSelectedSubject(subject); // Set the selected faculty for editing
        setShowForm(true);
    };

    const handleDeleteSubject = async (id) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            if (authHeader != null) {
                try {
                    const response = await fetch(`https://localhost:7118/api/Subject/${id}`, {
                        method: "DELETE",
                        headers: { ...authHeader }
                    });

                    if (response.ok) {
                        fetchGroups();
                    } else {
                        console.error('Failed to delete');
                        console.error(response);
                    }
                } catch (error) {
                    setError('An error occurred. Please try again.');
                    console.error(error);
                }
            } else {
                alert("User not authenticated");
            }
        }
    };

    const columns = [
        { key: "longName", header: "Name" },
        { key: "shortName", header: "Short Name" },
        { key: "professorName", header: "Professor" },
        { key: "departmentShortName", header: "Department" },
        { key: "examDuration", header: "Duration" },
        { key: "examType", header: "Exam Type" }
    ];

    return (
        <div>
            {showForm && (
                <SubjectForm
                    subject={selectedSubject}
                    onClose={() => setShowForm(false)}
                    onRefresh={fetchGroups}
                />
            )}

            <div className="data-management">
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search by short name"
                        value={search}
                        onChange={handleSearchChange}
                    />

                    <DepartmentSelector
                        selectName="departmentShortName" // Ensure this matches the key in subjectDetails
                        departmentValue={filterDepartment}
                        onDepartmentChange={handleDepartmentFilterChange}
                        includeNone={true}
                    />

                    <button className="data-management-button" onClick={handleSearch}>Search</button>
                    <button className="data-management-button" onClick={handleAddSubject}>Add Subject</button>
                </div>

                <GenericTable
                    columns={columns}
                    data={filteredSubject}
                    onEdit={handleEditSubject}
                    onDelete={handleDeleteSubject}
                />
            </div>
        </div>
    );
};

export default SubjectsManagementComponent;