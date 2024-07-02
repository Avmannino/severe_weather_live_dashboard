import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage.jsx'; // Ensure the path is correct based on your file structure

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                {/* Add more routes here as your project grows */}
            </Routes>
        </Router>
    );
}

export default App;

