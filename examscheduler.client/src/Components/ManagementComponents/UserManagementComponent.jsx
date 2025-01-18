import React, { useEffect, useState } from "react";
import UserForm from '../../Forms/UserForm';
import { getAuthHeader } from '../../Utils/AuthUtils';
import FacultySelector from '../../Utils/FacultySelector';
import RoleSelector from '../../Utils/RoleSelector';
import { getUserRole } from '../../Utils/RoleUtils';
import GenericTable from "../GenericTable/GenericTable";
import "./ManagementComponent.css";

const UserManagementComponent = () => {
    const [users, setUsers] = useState([]);
    const [emailSearch, setEmailSearch] = useState("");
    const [nameSearch, setNameSearch] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [filterFaculty, setFilterFaculty] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // For editing
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]); // Holds the filtered users
    const authHeader = getAuthHeader();

    const fetchUsers = async () => {
        try {
            if (authHeader) {
                const response = await fetch("https://localhost:7118/api/Admin/byRole", {
                    headers: {
                        ...authHeader
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                    setFilteredUsers(data); // Initialize the filtered list with all users
                } else {
                    console.error('Failed to get users');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        handleRefreshPage()
    }, []);

    const handleRefreshPage = () => {
        const role = getUserRole();
        setUserRole(role);
        fetchUsers();
        handleSearch();
    }

    const handleEmailSearchChange = (e) => setEmailSearch(e.target.value);
    const handleNameSearchChange = (e) => setNameSearch(e.target.value);
    const handleRoleFilterChange = (e) => setFilterRole(e.target.value);
    const handleFacultyFilterChange = (e) => setFilterFaculty(e.target.value);

    const handleSearch = () => {
        const filtered = users.filter(
            (user) =>
                user &&
                user.email &&
                user.email.toLowerCase().includes(!emailSearch ? '' : emailSearch.toLowerCase().trim()) &&
                (user.firstName.toLowerCase().includes(!nameSearch ? '' : nameSearch.toLowerCase().trim()) ||
                user.lastName.toLowerCase().includes(!nameSearch ? '' : nameSearch.toLowerCase().trim())) &&
                (!filterRole || user.role === filterRole) &&
                (filterFaculty === "" || (filterFaculty != "" && filterFaculty === user.faculty))
        );
        setFilteredUsers(filtered);
    };

    const handleAddUser = () => {
        setSelectedUser(null); // Clear selection for new user
        setShowForm(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user); // Set the selected user for editing
        setShowForm(true);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            if (authHeader != null) {
                try {
                    const response = await fetch(`https://localhost:7118/api/Admin/${id}`, {
                        method: "DELETE",
                        headers: { ...authHeader }
                    });
                    const data = await response.json();

                    if (response.ok) {
                        fetchUsers(); // Refresh the user list
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
        { key: "email", header: "Email" },
        { key: "firstName", header: "First Name" },
        { key: "lastName", header: "Last Name" },
        { key: "role", header: "Role" },
        { key: "faculty", header: "Faculty" },
    ];

    return (
        <div>
            {showForm && (
                <UserForm
                    user={selectedUser}
                    onClose={() => setShowForm(false)}
                    onRefresh={handleRefreshPage}
                />
            )}

            <div className="data-management">
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search by email"
                        value={emailSearch}
                        onChange={handleEmailSearchChange}
                    />

                    <input
                        type="text"
                        placeholder="Search by name"
                        value={nameSearch}
                        onChange={handleNameSearchChange}
                    />
                    <RoleSelector roleValue={filterRole} onRoleChange={handleRoleFilterChange} />

                    {userRole == 'Admin' &&
                        <FacultySelector
                            selectName="faculty"
                            facultyValue={filterFaculty}
                            onFacultyChange={handleFacultyFilterChange}
                            includeNone={true}
                            includeNoneText={"All Faculties"}
                        />}
                    <button className="data-management-button" onClick={handleSearch}>Search</button>
                    {(userRole == 'Admin' || userRole == 'FacultyAdmin') && <button className="data-management-button" onClick={handleAddUser}>Add User</button>}
                </div>

                <GenericTable
                    columns={columns}
                    data={filteredUsers}
                    onEdit={handleEditUser}
                    onDelete={userRole == 'Admin' || userRole == 'FacultyAdmin' ? handleDeleteUser : null}
                />
            </div>
        </div>
    );
};

export default UserManagementComponent;