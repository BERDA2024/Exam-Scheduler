import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css"; // importati stilizarile de form generice

// formul primeste un parametru model, practic puteti face ca sa transmiteti un obiect model ca sa editati cu form-ul sau daca nu timiteti un obiect, formul devine unul de adaugare
const FormTemplate = ({ model, onClose, onRefresh }) => {
    const [modelDetails, setModelDetails] = useState(model ? model : { modelParameter1: '', modelParameter2: '' }); // modificati parametrii modelului dupa cum vreti voi.
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const PostURL = getURL() + 'api/Controller/action'; // aici modificati string-ul cu api de post
    const PutURL = getURL() + 'api/Controller/action'; // aici modificati string-ul cu api de put

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setModelDetails((modelDetails) => ({
            ...modelDetails,
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
            const response = await fetch((model ? PutURL : PostURL), {
                method: (model ? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    ModelParameter1: modelDetails.modelParameter1, // aici ModelParameter trebuie sa fie exact ca in clasa .cs model
                    ModelParameter2: modelDetails.modelParameter2 // aici ModelParameter trebuie sa fie exact ca in clasa .cs model
                    // alti parametrii daca mai sunt
                }),
            });

            const text = await response.text();  // Get raw response text

            let result;
            try {
                result = JSON.parse(text);  // Attempt to parse it as JSON
            } catch (e) {
                setError("Invalid server response.");
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
                    {/* aici afiseaza parametrul asta doar daca userul este null. asa puteti ascunde/afisa parametrii cand vreti voi de ex asta e parametru pt form de adaugare*/}
                    {!model && (
                        <div className="form-input-div">
                            <label>Parameter1:</label>
                            <input
                                type="text"
                                name="modelParameter1"{/* asta trebuie sa fie exact lafel ca in parametrul din model, altfel nu editeaza valoarea*/}
                                value={modelDetails.modelParameter1}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    {/* Se afiseaza parametrul asta chiar daca este form de editare sau adaugare*/}
                    <div className="form-input-div">
                        <label>Parameter2:</label>
                        <input
                            type="text"
                            name="modelParameter2"
                            value={modelDetails.modelParameter2}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{user ? "Update" : "Add"} Model</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormTemplate;