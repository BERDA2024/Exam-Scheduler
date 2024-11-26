import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sample_img from "../assets/sample_img.jpeg";
import "../Styles/LoginPage.css";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use navigate instead of history

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:7118/api/User/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const text = await response.text();  // Get raw response text
            //console.log(text);  // Log raw response for inspection

            let result;
            try {
                result = JSON.parse(text);  // Attempt to parse it as JSON
            } catch (e) {
                //console.error("Failed to parse response as JSON:", e);
                setError("Invalid server response.");
                return;
            }

            if (response.ok && result.token) {
                localStorage.setItem('authToken', result.token);  // Store the token
                //console.log('Token stored in localStorage:', result.token);
                navigate('/dashboard');  // Redirect to dashboard
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            //console.log(error);
        }
    };

    // Navigate to Register Page
    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="container">

            {/* Secțiunea stângă */}
            <div className="left-section">

                <form onSubmit={handleSubmit}>

                    <div>

                        <h1>Welcome to ExamScheduler!</h1>

                    </div>
                    <div>
                        <input type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required />
                        <input type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required />

                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className="signup-btn"
                        onClick={goToRegister}>Don't have an account? Register
                    </button>

                </form>
            </div>

            {/* Secțiunea dreaptă */}
            <div
                className="right-section"
                style={{
                    backgroundImage: `url(${sample_img})`, // Folosește imaginea ca fundal
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>
        </div>
    );
};

export default LoginPage;