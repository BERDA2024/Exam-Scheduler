import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sample_img from "../assets/sample_img.jpeg";
import "../Styles/RegisterPage.css"

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('https://localhost:7118/api/User/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
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

            alert(result.message);
            if (response.ok) {
                navigate('/login'); // Redirect to login page after successful registration
            } else {
                setError(result.message || 'Registration failed');
                console.error(result.message);
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred. Please try again.');
        }
    };

    // Navigate to Login Page
    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            {/* Left Section */}
            <div className="left-section">
              
                
                <form onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}
                    <h2>Register</h2>
                   
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        />
                    
                    
                    <button type="submit">Register</button>
                    <button onClick={goToLogin}>Already have an account? Login</button>
                </form>
            </div>

            {/* Right Section */}
            <div
                className="right-section"
                style={{
                    backgroundImage: `url(${sample_img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>
        </div>
    );
};

export default RegisterPage;