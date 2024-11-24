import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Updated import
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';

const App = () => {
    return (
        <Router>
            <Routes> {/* Replaced Switch with Routes */}
                <Route path="/register" element={<RegisterPage />} />  {/* Updated syntax for Route */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/" element={<LoginPage />} />  {/* No need for 'exact' */}
            </Routes>
        </Router>
    );
};

export default App;