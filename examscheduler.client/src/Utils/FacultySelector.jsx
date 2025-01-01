import { useState, useEffect } from "react";
import { getURL } from './URLUtils';
import { getAuthHeader } from './AuthUtils';

const FacultySelector = ({ selectName = 'faculty', facultyValue, onFacultyChange, includeNone = false }) => {
    const [faculties, setFaculties] = useState([]);
    const URL = getURL();
    const authHeader = getAuthHeader();

    useEffect(() => {
        async function fetchRoles() {
            try {
                if (authHeader) {
                    const response = await fetch(URL + "api/Admin/faculties", {
                        headers: {
                            ...authHeader,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setFaculties(data);
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
        <select name={selectName} value={facultyValue} onChange={onFacultyChange}>
            {includeNone && <option key={0} value=''>None</option>}
            {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.shortName}>{faculty.shortName}</option>
            ))}
        </select>
    );
};

export default FacultySelector;