import { useState, useEffect } from "react";
import { getURL } from './URLUtils';
import { getAuthHeader } from './AuthUtils';

const RoleSelector = ({ selectName = 'role', roleValue, onRoleChange, includeAllRoles = true, includeNone = false }) => {
    const [roles, setRoles] = useState([]);
    const URL = getURL();
    const authHeader = getAuthHeader();

    useEffect(() => {
        async function fetchRoles() {
            try {
                if (authHeader) {
                    const response = await fetch(URL + "api/User/roleSelection", {
                        headers: {
                            ...authHeader,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setRoles(data);
                    } else {
                        console.error("Failed to fetch roles");
                    }
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        }
        fetchRoles();
    }, []);

    return (
        <select name={selectName} value={roleValue} onChange={onRoleChange}>
            {includeAllRoles && <option key={0} value=''>All Roles</option>}
            {includeNone && <option key={0} value=''>None</option>}
            {roles.map((role) => (
                <option key={role.id} value={role.name}>{role.name}</option>
            ))}
        </select>
    );
};

export default RoleSelector;