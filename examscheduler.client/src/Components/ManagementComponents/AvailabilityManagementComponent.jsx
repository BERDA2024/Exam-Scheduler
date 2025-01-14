import React, { useEffect, useState } from "react";
import { getAuthHeader } from '../../Utils/AuthUtils';
import GenericTable from "../GenericTable/GenericTable";
import "./ManagementComponent.css";
import AvailabilityForm from "../../Forms/AvailabilityForm";

const AvailabilityManagementComponent = () => {
    const [availabilities, setAvailabitities] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState(null); // For editing
    const [error, setError] = useState('');
    const [filteredAvailabilities, setFilteredAvailabilities] = useState([]); // Holds the filtered faculties
    const authHeader = getAuthHeader();

    const fetchAvailabilities = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/Availability", {
                    headers: {
                        ...authHeader
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAvailabitities(data);
                    setFilteredAvailabilities(data); // Initialize the filtered list with all faculties
                } else {
                    console.error('Failed to get availability');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAvailabilities();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const handleSearch = () => {
        const filtered = availabilities.filter(
            (availabilities) =>
                availabilities &&
                (availabilities.StartDate.toLowerCase().includes(!search ? '' : search.toLowerCase()) ||
                    availabilities.EndDate.toLowerCase().includes(!search ? '' : search.toLowerCase()))
        );
        setFilteredAvailabilities(filtered);
    };

    const handleAddAvailability = () => {
        setSelectedAvailability(null); // Clear selection for new faculty
        setShowForm(true);
    };

    const handleEditAvailability = (availability) => {
        setSelectedAvailability(availability); // Set the selected faculty for editing
        setShowForm(true);
    };

    const handleDeleteAvailability = async (id) => {
        if (window.confirm("Are you sure you want to delete this availability ")) {
            if (authHeader != null) {
                try {
                    const response = await fetch(`https://localhost:7118/api/Availability/${id}`, {
                        method: "DELETE",
                        headers: { ...authHeader }
                    });

                    if (response.ok) {
                        fetchAvailabilities();
                    } else {
                        console.error('Failed to delete');
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
        { key: "StartDate", header: "Start Date" },
        { key: "EndDate", header: "End Date" },
    ];

    return (
        <div>
            {showForm && (
                <AvailabilityForm
                    availability={selectedAvailability}
                    onClose={() => setShowForm(false)}
                    onRefresh={fetchAvailabilities}
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
                    <button className="data-management-button" onClick={handleAddAvailability}>Add Department</button>
                </div>

                <GenericTable
                    columns={columns}
                    data={filteredAvailabilities}
                    onEdit={handleEditAvailability}
                    onDelete={handleDeleteAvailability}
                />
            </div>
        </div>
    );
};

export default AvailabilityManagementComponent;