import { useState, useEffect } from "react";
import { getURL } from './URLUtils';
import { getAuthHeader } from './AuthUtils';

const SubjectSelector = ({ selectName = 'subject', subjectValue, onSubjectChange, includeNone = false, includeNoneText = 'None' }) => {
    const [subjects, setSubjects] = useState([]);
    const URL = getURL();
    const authHeader = getAuthHeader();

    useEffect(() => {
        async function fetchSubjects() {
            try {
                if (authHeader) {
                    const response = await fetch(URL + "api/Subject/add", {
                        headers: {
                            ...authHeader,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setSubjects(data);
                    } else {
                        console.error("Failed to fetch subjects");
                    }
                }
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        }
        fetchSubjects();
    }, []);

    return (
        <select name={selectName} value={subjectValue} onChange={onSubjectChange}>
            {includeNone && <option key={0} value=''>{includeNoneText}</option>}
            {subjects.map((subject) => (
                <option key={subject.id} value={subject.shortName}>{subject.shortName}</option>
            ))}
        </select>
    );
};

export default SubjectSelector;