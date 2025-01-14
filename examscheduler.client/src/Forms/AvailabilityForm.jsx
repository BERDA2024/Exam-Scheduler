import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css"; // importati stilizarile de form generice

// formul primeste un parametru model, practic puteti face ca sa transmiteti un obiect model ca sa editati cu form-ul sau daca nu timiteti un obiect, formul devine unul de adaugare
const AvailabilityForm = ({ availability, onClose, onRefresh }) => {
    const [availabilityDetails, setAvailabilityDetails] = useState(availability ? availability : { id: 0, startDate: '', endDate: '' }); // modificati parametrii modelului dupa cum vreti voi.
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setAvailabilityDetails((AvailabilityDetails) => ({
            ...AvailabilityDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        // verifica daca userul este autentificat. daca nu e nevoide pt api, puteti scoate if-ul asta. lafel scoateti si din headers "...authHeader".
        if (authHeader) {
            // fetch in functie de ce e, edit sau adaugare.
            const response = await fetch((!availability ? 'api/Availability/' : `api/Availability/${availabilityDetails.id}` ), {
                method: (availability ? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: availabilityDetails.id,
                    StartDate: availabilityDetails.startDate, // aici ModelParameter trebuie sa fie exact ca in clasa .cs model
                    EndDate: availabilityDetails.endDate // aici ModelParameter trebuie sa fie exact ca in clasa .cs model
                    // alti parametrii daca mai sunt
                }),
            });

            const text = await response.text();  // Get raw response text

            let result;
            try {
                result = JSON.parse(text);  // Attempt to parse it as JSON
            } catch (e) {
                setErrorMessage("Invalid server response.");
                console.error(e);
                return;
            }
            if (response.ok) {
                setSuccessMessage(result.message); // This will be the success message returned from the API
                onRefresh(); // Refresh the user list
                onClose(); // Close the form
            }
            else {
                setErrorMessage(result.message);
            }
        }
    };

    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={handleSubmit}>

                    <div className="form-input-div">
                        <label>Start Date:</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={availabilityDetails.startDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>End date:</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={availabilityDetails.endDate}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{availability ? "Update" : "Add"} Availability</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AvailabilityForm;