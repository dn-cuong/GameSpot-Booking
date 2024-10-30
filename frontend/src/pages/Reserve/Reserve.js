import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Reserve.css';
import mapImage from '../../assets/images/map.png';

const Reserve = () => {
    const [availableComputers, setAvailableComputers] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedComputer, setSelectedComputer] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (selectedDate) {
            fetchAvailableComputers(selectedDate);
        } else {
            setAvailableComputers([]);
        }
    }, [selectedDate]);

    const fetchAvailableComputers = async (date) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.post('http://localhost:3000/available-computers', { date }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const formattedComputers = response.data.map(item => `Computer #${item.computer_id}`);
            setAvailableComputers(formattedComputers);
            setSelectedComputer("");
        } catch (error) {
            console.error('Error fetching available computers:', error);
            alert('Failed to fetch available computers. Please try again later.');
        }
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleComputerSelect = (event) => {
        setSelectedComputer(event.target.value);
    };

    const makeReservation = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const computerId = selectedComputer.split('#')[1];
            const response = await axios.post('http://localhost:3000/reserve', {
                date: selectedDate,
                computer_id: computerId
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 201) {
                alert('Reservation made successfully!');
                navigate('/manage');
            }
        } catch (error) {
            console.error('Error making reservation:', error.response.data["message"]);
            alert(error.response.data["message"]);
        }
    };

    const handleConfirmSelection = (event) => {
        event.preventDefault();
        makeReservation();
    };

    const openModal = () => {
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="reserve_background">
            <div className="reserve_overlay"></div>
            <div className="reserve_container">
                <form onSubmit={handleConfirmSelection}>
                    <div className='text-contain'>
                        <button type="button" onClick={openModal} className="view-map">View Map</button>
                        <h3>Choose your date:</h3>
                    </div>
                    <label>
                        <input type="date" value={selectedDate} onChange={handleDateChange} required />
                    </label>
                    <h3>Available Computers for {selectedDate}:</h3>
                    <select value={selectedComputer} onChange={handleComputerSelect} disabled={!selectedDate} required>
                        <option value="">Select a Computer</option>
                        {availableComputers.length > 0 ? (
                            availableComputers.map((computer, index) => (
                                <option key={index} value={computer}>{computer}</option>
                            ))
                        ) : (
                            <option disabled>No computers available.</option>
                        )}
                    </select>
                    <button type="submit" disabled={!selectedComputer} className="submit">Make a reservation</button>
                </form>

                {/* Modal for Viewing Map */}
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h3>Computer Map</h3>
                            <img src={mapImage} alt="Computer Map" style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reserve;
