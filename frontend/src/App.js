import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Reserve from './pages/Reserve/Reserve';
import Header from './components/Header';
import Slideshow from './components/Slideshow';
import Manage from './pages/Manage/Manage';
import NotFound from './pages/NotFound/NotFound';
import Dashboard from './pages/Dashboard/Dashboard';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [usfId, setUsfId] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = () => {
            const token = localStorage.getItem('jwt');
            if (token) {
                const userData = JSON.parse(atob(token.split('.')[1]));
                setUsfId(userData.usf_id);
                setRole(userData.usf_role);
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    const handleLogin = (usfId) => {
        setIsLoggedIn(true);
        setUsfId(usfId);
        const token = localStorage.getItem('jwt');
        if (token) {
            const userData = JSON.parse(atob(token.split('.')[1]));
            setRole(userData.usf_role);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
        setUsfId('');
        setRole('');
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} usfId={usfId} usfRole={role} onLogout={handleLogout} />
            <Routes>
                <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
                
                <Route 
                    path="/reserve" 
                    element={isLoggedIn && role !== 'admin' ? <Reserve /> : <Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} 
                />
                <Route 
                    path="/manage" 
                    element={isLoggedIn && role !== 'admin' ? <Manage /> : <Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} 
                />
                <Route path="/" element={<Slideshow role={role} />} />
                
                <Route 
                    path="/dashboard" 
                    element={isLoggedIn && role === 'admin' ? <Dashboard /> : <Navigate to={isLoggedIn ? "/" : "/login"} />} 
                />
                
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
