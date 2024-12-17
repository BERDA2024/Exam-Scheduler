import React, { useEffect, useState } from "react";
import { getAuthHeader } from '../../Utils/AuthUtils';
//import ClassroomForm from '../../Forms/ClassroomForm';

import GenericTable from "../GenericTable/GenericTable";
import "./UserManagementComponent.css";

const ClassroomsManagementComponent = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null); // For editing
    const [error, setError] = useState('');
    const [filteredClassrooms, setFilteredClassrooms] = useState([]); // Holds the filtered faculties
    const authHeader = getAuthHeader();

    const fetchClassrooms = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/Classroom", {
                    headers: {
                        ...authHeader
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setClassrooms(data);
                    setFilteredClassrooms(data); // Initialize the filtered list with all faculties
                } else {
                    console.error('Failed to get classrooms');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const handleSearch = () => {
        const filtered = classrooms.filter(
            (classrooms) =>
                classrooms &&
                (classrooms.name.toLowerCase().includes(!search ? '' : search.toLowerCase()) ||
                    classrooms.shortName.toLowerCase().includes(!search ? '' : search.toLowerCase() ||
                        classrooms.buildingName.toLowerCase().includes(!search ? '' : search.toLowerCase()
                    ))),
        );
        setFilteredClassrooms(filtered);
    };

    const handleAddClassrooms = () => {
        setSelectedClassroom(null); // Clear selection for new faculty
        setShowForm(true);
    };

    const handleEditClassroom = (classroom) => {
        setSelectedClassroom(classroom); // Set the selected faculty for editing
        setShowForm(true);
    };

    const handleDeleteClassroom = async (id) => {
        if (window.confirm("Are you sure you want to delete this classroom?")) {
            if (authHeader != null) {
                try {
                    const response = await fetch(`https://localhost:7118/api/Classroom/${id}`, {
                        method: "DELETE",
                        headers: { ...authHeader }
                    });
                    const data = await response.json();

                    if (response.ok) {
                        fetchClassrooms();
                        console.log(data);
                    } else {
                        console.error('Failed to delete');
                        console.error(data);
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
        { key: "name", header: "Name" },
        { key: "shortName", header: "Short Name" },
        { key:"buildingName", header: "Building Name"}
    ];

    return (
        <div>
            {showForm && (
                <ClassroomForm
                    department={selectedClassroom}
                    onClose={() => setShowForm(false)}
                    onRefresh={fetchClassrooms}
                />
            )}

            <div className="data-management">
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <button className="data-management-button" onClick={handleSearch}>Search</button>
                    <button className="data-management-button" onClick={handleAddClassrooms}>Add Classroom</button>
                </div>

                <GenericTable
                    columns={columns}
                    data={filteredClassrooms}
                    onEdit={handleEditClassroom}
                    onDelete={handleDeleteClassroom}
                />
            </div>
        </div>
    );
};

export default ClassroomsManagementComponent;