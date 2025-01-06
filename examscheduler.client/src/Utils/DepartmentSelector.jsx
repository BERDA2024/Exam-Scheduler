import { useState, useEffect } from "react";
import { getURL } from './URLUtils';
import { getAuthHeader } from './AuthUtils';

const DepartmentSelector = ({ selectName = 'department', departmentValue, onDepartmentChange, includeNone = false, includeNoneText = 'None' }) => {
    const [departments, setDepartments] = useState([]);
    const URL = getURL();
    const authHeader = getAuthHeader();

    useEffect(() => {
        async function fetchDepartments() {
            try {
                if (authHeader) {
                    const response = await fetch(URL + "api/Department", {
                        headers: {
                            ...authHeader,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setDepartments(data);
                    } else {
                        console.error("Failed to fetch departments");
                    }
                }
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        }
        fetchDepartments();
    }, []);

    return (
        <select name={selectName} value={departmentValue} onChange={onDepartmentChange}>
            {includeNone && <option key={0} value=''>{includeNoneText}</option>}
            {departments.map((department) => (
                <option key={department.id} value={department.shortName}>{department.shortName}</option>
            ))}
        </select>
    );
};

export default DepartmentSelector;