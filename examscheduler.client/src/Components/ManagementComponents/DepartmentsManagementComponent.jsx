import React, { useEffect, useState } from "react";
import DepartmentForm from '../../Forms/DepartmentForm';
import { getAuthHeader } from '../../Utils/AuthUtils';
import GenericTable from "../GenericTable/GenericTable";
import "./UserManagementComponent.css";

const DepartmentsManagementComponent = () => {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null); // For editing
    const [error, setError] = useState('');
    const [filteredDepartments, setFilteredDepartments] = useState([]); // Holds the filtered faculties
    const authHeader = getAuthHeader();

    const fetchDepartments = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/Department", {
                    headers: {
                        ...authHeader
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setDepartments(data);
                    setFilteredDepartments(data); // Initialize the filtered list with all faculties
                } else {
                    console.error('Failed to get departments');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const handleSearch = () => {
        const filtered = departments.filter(
            (departments) =>
                departments &&
                (departments.longName.toLowerCase().includes(!search ? '' : search.toLowerCase()) ||
                    departments.shortName.toLowerCase().includes(!search ? '' : search.toLowerCase()))
        );
        setFilteredDepartments(filtered);
    };

    const handleAddDepartment = () => {
        setSelectedDepartment(null); // Clear selection for new faculty
        setShowForm(true);
    };

    const handleEditDepartment = (department) => {
        console.log(department);
        setSelectedDepartment(department); // Set the selected faculty for editing
        setShowForm(true);
    };

    const handleDeleteDepartment = async (id) => {
        if (window.confirm("Are you sure you want to delete this department")) {
            if (authHeader != null) {
                try {
                    const response = await fetch(`https://localhost:7118/api/Department/${id}`, {
                        method: "DELETE",
                        headers: { ...authHeader }
                    });
                    const data = await response.json();

                    if (response.ok) {
                        fetchDepartments();
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
                <DepartmentForm
                    department={selectedDepartment}
                    onClose={() => setShowForm(false)}
                    onRefresh={fetchDepartments}
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
                    <button className="data-management-button" onClick={handleAddDepartment}>Add Department</button>
                </div>

                <GenericTable
                    columns={columns}
                    data={filteredDepartments}
                    onEdit={handleEditDepartment}
                    onDelete={handleDeleteDepartment}
                />
            </div>
        </div>
    );
};

export default DepartmentsManagementComponent;