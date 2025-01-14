import { useState, useEffect } from "react";
import { getURL } from './URLUtils';
import { getAuthHeader } from './AuthUtils';

const GroupSelector = ({ selectName = 'group', groupValue, onGroupChange, includeNone = false, includeNoneText = 'None' }) => {
    const [groups, setGroups] = useState([]);
    const URL = getURL();
    const authHeader = getAuthHeader();

    useEffect(() => {
        async function fetchGroups() {
            try {
                if (authHeader) {
                    const response = await fetch(URL + "api/Group", {
                        headers: {
                            ...authHeader,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setGroups(data);
                    } else {
                        console.error("Failed to fetch groups");
                    }
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        }
        fetchGroups();
    }, []);

    return (
        <select name={selectName} value={groupValue} onChange={onGroupChange}>
            {includeNone && <option key={0} value=''>{includeNoneText}</option>}
            {groups.map((group) => (
                <option key={group.id} value={group.groupName}>{group.groupName}</option>
            ))}
        </select>
    );
};

export default GroupSelector;