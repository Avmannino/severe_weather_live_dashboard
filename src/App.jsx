import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx'; // Ensure the path is correct based on your file structure
import Dashboard from './components/Dashboard.jsx';
import Navbar from './components/Navbar.jsx'; // Import the Navbar component

function App() {
    return (
        <Router>
            <MainApp />
        </Router>
    );
}

const MainApp = () => {
    const location = useLocation();
    const showNavbar = location.pathname !== '/';

    return (
        <>
            {showNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Add more routes here as your project grows */}
            </Routes>
        </>
    );
}

export default App;
