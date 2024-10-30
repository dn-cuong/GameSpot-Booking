// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from "../assets/images/logo.png";

const Header = ({ isLoggedIn, usfId, usfRole}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [role, setRole] = useState("")
    const navigate = useNavigate(); // Import useNavigate hook

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
          const userData = JSON.parse(atob(token.split('.')[1]));
          setRole(userData.usf_role);
        }
      }, []);
    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        window.location.reload(); 
    };

    const handleUsfIdClick = () => {
        const token = localStorage.getItem('jwt');
        const userData = JSON.parse(atob(token.split('.')[1]));
        setRole(userData.usf_role)
        if(userData.usf_role === "admin") {
        navigate('/dashboard'); 

        } else {
        navigate('/manage')}; 
    };

    return (
        <header className="header">
            <div className="hamburger" onClick={toggleMenu}>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
            </div>
            <div className="logo">
                <img src={logo} alt="Logo" className="logo-image" />
                <Link to="/">USF, GO BULLS</Link>
            </div>
            {role !== "admin" ? 
            <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                <ul className="nav-links">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About Us</Link>
                    </li>
                    <li>
                        <Link to="/reserve">Reserve</Link>
                    </li>
                </ul>
            </nav>
            : ''}
            <div className="auth-buttons">
                {isLoggedIn ? (
                    <>
                        <span onClick={handleUsfIdClick} className="button" style={{ cursor: 'pointer' }}>
                            {usfId}
                        </span>
                        <button onClick={handleLogout} className="button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="button">Login</Link>
                        <Link to="/register" className="button">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
