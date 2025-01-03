import React, { useState, useEffect } from "react";
import { getAuthHeader } from '../../Utils/AuthUtils';
import GenericTable from "../GenericTable/GenericTable";
import FacultyForm from '../../Forms/FacultyForm';
import "./ManagementComponent.css";

const FacultiesManagementComponent = () => {
    const [faculties, setFaculties] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null); // For editing
    const [error, setError] = useState('');
    const [filteredFaculties, setFilteredFaculties] = useState([]); // Holds the filtered faculties
    const authHeader = getAuthHeader();

    const fetchFaculties = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/Admin/faculties", {
                    headers: {
                        ...authHeader
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFaculties(data);
                    setFilteredFaculties(data); // Initialize the filtered list with all faculties
                } else {
                    console.error('Failed to get faculties');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const handleSearch = () => {
        const filtered = faculties.filter(
            (faculty) =>
                faculty &&
                (faculty.longName.toLowerCase().includes(!search ? '' : search.toLowerCase()) ||
                    faculty.shortName.toLowerCase().includes(!search ? '' : search.toLowerCase()))
        );
        setFilteredFaculties(filtered);
    };

    const handleAddFaculty = () => {
        setSelectedFaculty(null); // Clear selection for new faculty
        setShowForm(true);
    };

    const handleEditFaculty = (faculty) => {
        setSelectedFaculty(faculty); // Set the selected faculty for editing
        setShowForm(true);
    };

    const handleDeleteFaculty = async (id) => {
        if (window.confirm("Are you sure you want to delete this faculty?")) {
            if (authHeader != null) {
                try {
                    const response = await fetch(`https://localhost:7118/api/Admin/faculties/${id}`, {
                        method: "DELETE",
                        headers: { ...authHeader }
                    });
                    const data = await response.json();

                    if (response.ok) {
                        fetchFaculties();
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
        { key: "longName", header: "Long Name" },
        { key: "shortName", header: "Short Name" },
    ];

    return (
        <div>
            {showForm && (
                <FacultyForm
                    faculty={selectedFaculty}
                    onClose={() => setShowForm(false)}
                    onRefresh={fetchFaculties}
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
                    <button className="data-management-button" onClick={handleAddFaculty}>Add Faculty</button>
                </div>

                <GenericTable
                    columns={columns}
                    data={filteredFaculties}
                    onEdit={handleEditFaculty}
                    onDelete={handleDeleteFaculty}
                />
            </div>
        </div>
    );
};

export default FacultiesManagementComponent;