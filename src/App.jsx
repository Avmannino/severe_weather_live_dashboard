import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import MyAccount from './components/MyAccount.jsx';
import { AuthProvider } from './components/AuthContext.jsx';

function App() {
    return (
        <AuthProvider>
            <Router>
                <MainApp />
            </Router>
        </AuthProvider>
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
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/my-account" element={<MyAccount />} />
                {/* Add more routes here as your project grows */}
            </Routes>
        </>
    );
}

export default App;
