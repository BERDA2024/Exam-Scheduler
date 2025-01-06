import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css";
import DepartmentSelector from "../Utils/DepartmentSelector";

const SubgroupForm = ({ subgroup, onClose, onRefresh }) => {
    const [subgroupDetails, setSubgroupDetails] = useState(subgroup ? subgroup : { id: 0, groupName: '', subgroupIndex: '', fullName: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const address = getURL();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setSubgroupDetails((subgroupDetails) => ({
            ...subgroupDetails,
            [name]: value, // Dynamically update the corresponding property
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        if (authHeader) {
            const response = await fetch(address + `api/Subgroup/` + (subgroup ? `${ subgroupDetails.id }` : ``), {
                method: (subgroup? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: subgroupDetails.id,
                    GroupName: subgroupDetails.groupName,
                    SubgroupIndex: subgroupDetails.subgroupIndex.toLowerCase(),
                    FullName: subgroupDetails.fullName
                }),
            });
            if (response.ok) {
                setSuccessMessage(response.message);
                onRefresh(); // Refresh the list
                onClose(); // Close the form
            }
            else {
                setErrorMessage('Operation Failed. ' + response.message);
                console.error(response);
            }
        }
    };

    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={handleSubmit}>

                    <div className="form-input-div">
                        <label>Group Name:</label>
                        <input
                            type="text"
                            name="groupName"
                            value={subgroupDetails.groupName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Index:</label>
                        <input
                            type="text"
                            name="subgroupIndex"
                            value={subgroupDetails.subgroupIndex}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only a single character that is a letter (a-z, A-Z)
                                if (value.length <= 1 && /^[a-zA-Z]?$/.test(value)) {
                                    handleChange(e);
                                }
                            }}
                        />
                    </div>

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{subgroup ? "Update" : "Add"} Subgroup</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubgroupForm;