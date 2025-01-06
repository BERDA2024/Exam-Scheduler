import React, { useState, useEffect } from "react";
import { getAuthHeader } from '../../Utils/AuthUtils';
import GenericTable from "../GenericTable/GenericTable";
import "./ManagementComponent.css";
import SubgroupForm from "../../Forms/SubgroupForm";

const SubgroupsManagementComponent = () => {
    const [subgroups, setSubgroups] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedSubgroup, setSelectedSubgroup] = useState(null); // For editing
    const [error, setError] = useState('');
    const [filteredSubgroup, setFilteredSubgroups] = useState([]); // Holds the filtered faculties
    const authHeader = getAuthHeader();

    const fetchSubgroups = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/Subgroup", {
                    headers: {
                        ...authHeader
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSubgroups(data);
                    setFilteredSubgroups(data); // Initialize the filtered list with all subgroups
                } else {
                    console.error('Failed to get subgroups');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSubgroups();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const handleSearch = () => {
        const filtered = subgroups.filter(
            (subgroup) =>
                subgroup &&
                subgroup.fullName.toLowerCase().includes(!search ? '' : search.toLowerCase())
        );
        setFilteredSubgroups(filtered);
    };

    const handleAddSubgroup = () => {
        setSelectedSubgroup(null); // Clear selection for new faculty
        setShowForm(true);
    };

    const handleEditSubgroup = (subgroup) => {
        setSelectedSubgroup(subgroup); // Set the selected faculty for editing
        setShowForm(true);
    };

    const handleDeleteSubgroup = async (id) => {
        if (window.confirm("Are you sure you want to delete this subgroup?")) {
            if (authHeader != null) {
                try {
                    const response = await fetch(`https://localhost:7118/api/Subgroup/${id}`, {
                        method: "DELETE",
                        headers: { ...authHeader }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        fetchSubgroups();
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
        { key: "fullName", header: "Name" },
    ];

    return (
        <div>
            {showForm && (
                <SubgroupForm
                    subgroup={selectedSubgroup}
                    onClose={() => setShowForm(false)}
                    onRefresh={fetchSubgroups}
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
                    <button className="data-management-button" onClick={handleAddSubgroup}>Add Subgroup</button>
                </div>

                <GenericTable
                    columns={columns}
                    data={filteredSubgroup}
                    onEdit={handleEditSubgroup}
                    onDelete={handleDeleteSubgroup}
                />
            </div>
        </div>
    );
};

export default SubgroupsManagementComponent;