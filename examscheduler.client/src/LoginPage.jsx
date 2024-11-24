import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            console.log(text);  // Log raw response for inspection

            let result;
            try {
                result = JSON.parse(text);  // Attempt to parse it as JSON
            } catch (e) {
                console.error("Failed to parse response as JSON:", e);
                setError("Invalid server response.");
                return;
            }

            if (response.ok && result.token) {
                localStorage.setItem('authToken', result.token);  // Store the token
                console.log('Token stored in localStorage:', result.token);
                navigate('/dashboard');  // Redirect to dashboard
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.log(error);
        }
    };

    // Navigate to Register Page
    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
            <button onClick={goToRegister}>Don't have an account? Register</button>  {/* Register Button */}
        </div>
    );
};

export default LoginPage;