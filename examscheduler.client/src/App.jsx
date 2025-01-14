import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import Layout from './Layout/Layout';
<<<<<<< Updated upstream
import NotificationsPage from './pages/NotificationsPage'; // Import nou pentru NotificationsPage
=======
import NotificationsPage from './Pages/NotificationsPage'; // Import corectat pentru NotificationsPage
>>>>>>> Stashed changes

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Layout />} />
                <Route path="/" element={<LoginPage />} />
<<<<<<< Updated upstream
                {/* Înlocuim notificările vechi cu noua pagină de notificări */}
                <Route path="/notifications" element={<NotificationsPage />} />
=======
                <Route path="/notifications" element={<NotificationsPage />} /> {/* Pagina notificărilor */}
>>>>>>> Stashed changes
            </Routes>
        </Router>
    );
};

export default App;
