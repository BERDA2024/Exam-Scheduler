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
                const response = await fetch("https://localhost:7118/api/Availability/availability-by-professor", {
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
                (availabilities.startDate.toLowerCase().includes(!search ? '' : search.toLowerCase()) ||
                    availabilities.endDate.toLowerCase().includes(!search ? '' : search.toLowerCase()))
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAvailability({ ...availability, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const authHeader = getAuthHeader();
            const response = await fetch('https://localhost:7118/api/Availability', {
                method: 'POST',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(availability),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add availability');
            }

            setSuccess(true);
            setAvailability({ startDate: '', endDate: '' }); // Resetează formularul
            fetchAvailabilities(); // Actualizează lista de disponibilități
        } catch (error) {
            setError(error.message);
        }
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
        { key: "startDate", header: "Start Date" },
        { key: "endDate", header: "End Date" },
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
                    <button className="data-management-button" onClick={handleAddAvailability}>Add Availability</button>
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