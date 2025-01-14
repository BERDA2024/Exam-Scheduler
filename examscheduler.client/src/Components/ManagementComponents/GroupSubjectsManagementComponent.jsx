import React, { useEffect, useState } from "react";
import GroupSubjectForm from '../../Forms/GroupSubjectForm';
import { getAuthHeader } from '../../Utils/AuthUtils';
import GroupSelector from "../../Utils/GroupSelector";
import SubjectSelector from "../../Utils/SubjectSelector";
import GenericTable from "../GenericTable/GenericTable";
import "./ManagementComponent.css";

const GroupSubjectsManagementComponent = () => {
    const [groupSubjects, setGroupSubjects] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null); // For editing
    const [error, setError] = useState('');
    const [filteredGroupSubjects, setFilteredGroupSubjects] = useState([]); // Holds the filtered groups
    const [filterSubject, setFilterSubject] = useState("");
    const [filterGroup, setFilterGroup] = useState("");
    const authHeader = getAuthHeader();

    const fetchGroupSubjects = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/GroupSubject", {
                    headers: {
                        ...authHeader
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setGroupSubjects(data);
                    setFilteredGroupSubjects(data); // Initialize the filtered list with all groups
                } else {
                    console.error('Failed to get group subjects');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGroupSubjects();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleSubjectFilterChange = (e) => setFilterSubject(e.target.value);
    const handleGroupFilterChange = (e) => setFilterGroup(e.target.value);

    const handleSearch = () => {
        const filtered = groupSubjects.filter(
            (groupsubject) =>
                groupsubject &&
                (filterSubject === "" || (filterSubject != "" && filterSubject === groupsubject.subjectName)) &&
                (filterGroup === "" || (filterGroup != "" && filterGroup === groupsubject.groupName.toString()))
        );
        setFilteredGroupSubjects(filtered);
    };

    const handleAddGroupSubject = () => {
        setSelectedGroup(null); // Clear selection for new faculty
        setShowForm(true);
    };

    const handleEditGroupSubject = (faculty) => {
        setSelectedGroup(faculty); // Set the selected faculty for editing
        setShowForm(true);
    };

    const handleDeleteGroupSubject = async (id) => {
        if (window.confirm("Are you sure you want to delete this group subject?")) {
            if (authHeader != null) {
                try {
                    const response = await fetch(`https://localhost:7118/api/GroupSubject/${id}`, {
                        method: "DELETE",
                        headers: { ...authHeader }
                    });

                    if (response.ok) {
                        fetchGroupSubjects();
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
        { key: "groupName", header: "Group Name" },
        { key: "subjectName", header: "Subject" }
    ];

    return (
        <div>
            {showForm && (
                <GroupSubjectForm
                    groupSubject={selectedGroup}
                    onClose={() => setShowForm(false)}
                    onRefresh={fetchGroupSubjects}
                />
            )}

            <div className="data-management">
                <div className="controls">

                    <SubjectSelector
                        selectName="subject"
                        subjectValue={filterSubject}
                        onSubjectChange={handleSubjectFilterChange}
                        includeNone={true}
                        includeNoneText={"All subjects"}
                    />

                    <GroupSelector
                        selectName="group"
                        groupValue={filterGroup}
                        onGroupChange={handleGroupFilterChange}
                        includeNone={true}
                        includeNoneText={"All groups"}
                    />
                    <button className="data-management-button" onClick={handleSearch}>Search</button>
                    <button className="data-management-button" onClick={handleAddGroupSubject}>Add Group Subject</button>
                </div>

                <GenericTable
                    columns={columns}
                    data={filteredGroupSubjects}
                    onEdit={handleEditGroupSubject}
                    onDelete={handleDeleteGroupSubject}
                />
            </div>
        </div>
    );
};

export default GroupSubjectsManagementComponent;