// src/pages/Login/Login.js
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [usfEmail, setUsfEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            navigate('/dashboard'); // Redirect to home if already logged in
        }
    }, [navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        try {
            const response = await axios.post('/login', {
                usf_mail: usfEmail,
                password: password,
            });
            const token = response.data["token"];
            console.log(token);
            localStorage.setItem('jwt', token);
            
            const userData = JSON.parse(atob(token.split('.')[1])); 
            localStorage.setItem('usf_id', userData.usf_id);
            onLogin(userData.usf_id);
            console.log(userData.usf_role);
            setSuccessMessage('Login successfully! Redirecting...');
            if (userData.usf_role === "admin") {
                window.location.href="/dashboard";
            } else {
                window.location.href="/";
            }
        } catch (e) {
            if (e.response && e.response.data) {
                setError(e.response.data);
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <div className="container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <div className="error-popup">{error}</div>}
                {successMessage && <div className="success-popup">{successMessage}</div>}
                <div className="form-group">
                    <label htmlFor="email">USF Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your USF email (@usf.edu)"
                        required
                        value={usfEmail}
                        onChange={(e) => setUsfEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className="show-password"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <button type="submit" className="login-button">Login</button>
                <div className="forgot-password">
                    <a href="/forgot">Forgot password?</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
