import React, { useState, useEffect } from "react";
import { getAuthHeader } from '../../Utils/AuthUtils';
import GenericTable from "../GenericTable/GenericTable";
import GroupForm from '../../Forms/GroupForm';
import DepartmentSelector from '../../Utils/DepartmentSelector';
import "./ManagementComponent.css";

const GroupsManagementComponent = () => {
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null); // For editing
    const [error, setError] = useState('');
    const [filteredGroups, setFilteredGroups] = useState([]); // Holds the filtered groups
    const [filterDepartment, setFilterDepartment] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const authHeader = getAuthHeader();

    const fetchGroups = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/Group", {
                    headers: {
                        ...authHeader
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setGroups(data);
                    setFilteredGroups(data); // Initialize the filtered list with all groups
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
    const handleStudyYearFilterChange = (e) => setFilterYear(e.target.value);

    const handleSearch = () => {
        const filtered = groups.filter(
            (group) =>
                group &&
                group.groupName.toLowerCase().includes(!search ? '' : search.toLowerCase()) &&
                (filterDepartment === "" || (filterDepartment != "" && filterDepartment === group.departmentName)) &&
                (filterYear === "" || (filterYear != "" && filterYear === group.studyYear.toString()))
        );
        setFilteredGroups(filtered);
    };

    const handleAddGroup = () => {
        setSelectedGroup(null); // Clear selection for new faculty
        setShowForm(true);
    };

    const handleEditGroup = (faculty) => {
        setSelectedGroup(faculty); // Set the selected faculty for editing
        setShowForm(true);
    };

    const handleDeleteGroup = async (id) => {
        if (window.confirm("Are you sure you want to delete this group?")) {
            if (authHeader != null) {
                try {
                    const response = await fetch(`https://localhost:7118/api/Group/${id}`, {
                        method: "DELETE",
                        headers: { ...authHeader }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
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
        { key: "groupName", header: "Name" },
        { key: "departmentName", header: "Department" },
        { key: "studyYear", header: "Study Year" }
    ];

    return (
        <div>
            {showForm && (
                <GroupForm
                    group={selectedGroup}
                    onClose={() => setShowForm(false)}
                    onRefresh={fetchGroups}
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

                    <DepartmentSelector
                        selectName="department" // Ensure this matches the key in groupDetails
                        departmentValue={filterDepartment}
                        onDepartmentChange={handleDepartmentFilterChange}
                        includeNone={true}
                    />

                    <select
                        name="studyYear"
                        value={filterYear}
                        onChange={handleStudyYearFilterChange}
                    >
                        <option value="">All Years</option>
                        {["1", "2", "3", "4", "5", "6"].map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <button className="data-management-button" onClick={handleSearch}>Search</button>
                    <button className="data-management-button" onClick={handleAddGroup}>Add Group</button>
                </div>

                <GenericTable
                    columns={columns}
                    data={filteredGroups}
                    onEdit={handleEditGroup}
                    onDelete={handleDeleteGroup}
                />
            </div>
        </div>
    );
};

export default GroupsManagementComponent;