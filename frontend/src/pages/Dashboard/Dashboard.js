import React, { useState, useEffect } from 'react';
import { FaLaptop } from 'react-icons/fa'; // Import the laptop icon
import "./Dashboard.css";

const Dashboard = () => {
    const [machines, setMachines] = useState([]);
    const [currentDate] = useState(() => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${month}/${date}/${year}`;
    });

    useEffect(() => {
        // Fetch machine data from the server
        const fetchMachines = async () => {
            try {
                const response = await fetch('/dashboard');
                const data = await response.json();
                setMachines(data);
            } catch (error) {
                console.error("Error fetching machine data:", error);
            }
        };
        fetchMachines();
    }, []);

    return (
        <div className='dashboard'>
            <h1>Machine Status for {currentDate}</h1>
            <div className="machine-grid">
                {machines.map((machine, index) => (
                    <div key={index} className={`machine-card ${machine.status}`}>
                        <div className="machine-icon">
                            <FaLaptop className="icon" /> {/* FaLaptop icon from react-icons */}
                        </div>
                        <div className="machine-info">
                            <h3>Machine {machine.computer_id}</h3>
                            <p>Status: {machine.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
