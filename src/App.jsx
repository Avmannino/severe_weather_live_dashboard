import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx'; // Ensure the path is correct based on your file structure
import Dashboard from './components/Dashboard.jsx';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Add more routes here as your project grows */}
            </Routes>
        </Router>
    );
}

export default App;

