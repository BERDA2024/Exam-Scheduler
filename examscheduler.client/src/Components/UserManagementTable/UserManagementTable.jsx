import React, { useState, useEffect } from "react";
import "./UserManagementTable.css";
import { getAuthHeader } from '../../Utils/AuthUtils';
import UserForm from '../../Forms/UserForm';

const UserManagementTable = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // For editing
    const [error, setError] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]); // Holds the filtered users
    const authHeader = getAuthHeader();

    const fetchUsers = async () => {
        try {
            const response = await fetch("https://localhost:7118/api/Admin");
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data); // Initialize the filtered list with all users
            } else {
                console.error('Failed to get users');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const handleFilterChange = (e) => setFilterRole(e.target.value);

    const handleSearch = () => {
        const filtered = users.filter(
            (user) =>
                user &&
                user.email &&
                user.email.toLowerCase().includes(!search ? '' : search.toLowerCase()) &&
                (!filterRole || user.role === filterRole)
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

    return (
        <div>
            {showForm && (
                <UserForm
                    user={selectedUser}
                    onClose={() => setShowForm(false)}
                    onRefresh={fetchUsers}
                />
            )}

            <div className="user-management">
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search by email"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <select value={filterRole} onChange={handleFilterChange}>
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Professor">Professor</option>
                        <option value="DepartmentHead">Department Head</option>
                        <option value="Student">Student</option>
                        <option value="StudentGroupLeader">Student Group Leader</option>
                    </select>
                    <button className="user-management-button" onClick={handleSearch}>Search</button>
                    <button className="user-management-button" onClick={handleAddUser}>Add User</button>
                </div>


                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.role}</td>
                                <td className="controls">
                                    <button
                                        className="user-management-button"
                                        onClick={() => handleEditUser(user)}
                                        disabled={user.role === "Admin"}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="user-management-button"
                                        onClick={() => handleDeleteUser(user.id)}
                                        disabled={user.role === "Admin"}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementTable;