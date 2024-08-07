import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home.jsx';
import Dashboard from './components/Dashboard.jsx';
import Pricing from './components/Pricing.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import MyAccount from './components/MyAccount.jsx';
import Loading from './components/Loading.jsx';
import Contact from './components/Contact.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = (navigate) => {
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <Router>
            <MainApp 
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
                onLogout={handleLogout}
            />
        </Router>
    );
}

const MainApp = ({ isAuthenticated, onLogin, onLogout }) => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const handleLoading = setTimeout(() => {
            setLoading(false);
        }, 700); // 0.5 seconds loading time

        return () => clearTimeout(handleLoading);
    }, [location.pathname]);

    return (
        <>
            {loading && <Loading />}
            {!loading && <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />}
            {!loading && (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/login" element={<Login onLogin={onLogin} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/my-account" element={<MyAccount />} />
                    <Route path="/contact-us" element={<Contact />} />
                </Routes>
            )}
        </>
    );
}

export default App;
