import React, { useState } from 'react';
import axios from '../../axiosConfig'; 
import './Register.css';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [usfId, setUsfId] = useState('');
    const [usfEmail, setUsfEmail] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const response = await axios.post('/register', {
                usf_id: usfId,
                first_name: firstName,
                last_name: lastName,
                usf_mail: usfEmail,
                usf_role: academicYear,
                password: password,
            });
            setSuccessMessage(response.data["message"])
        } catch (e) {
            if (e.response && e.response["data"]) {
                setError(e.response["data"]);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                {error && <div className="error-popup">{error}</div>}
                {successMessage && <div className="success-popup">{successMessage}</div>}
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        placeholder="Enter your first name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Enter your last name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="usfId">USF ID</label>
                    <input
                        type="text"
                        id="usfId"
                        placeholder="Enter your USF ID"
                        required
                        value={usfId}
                        onChange={(e) => setUsfId(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="usfEmail">USF Email</label>
                    <input
                        type="email"
                        id="usfEmail"
                        placeholder="Enter your USF email"
                        required
                        value={usfEmail}
                        onChange={(e) => setUsfEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="academicYear">Academic Year</label>
                    <select
                        id="academicYear"
                        required
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                    >
                        <option value="" disabled>Select your academic year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="register-button">Register</button>

                <div className="forgot-password">
                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </form>
        </div>
    );
};

export default Register;
