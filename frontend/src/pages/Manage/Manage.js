import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLaptop } from 'react-icons/fa'; // Import an icon for the computer
import './Manage.css'; // Assuming you have a CSS file for styling

const Manage = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('jwt'); // Retrieve token from local storage
            const usf_id = localStorage.getItem('usf_id'); // Retrieve usf_id from local storage
            const response = await axios.post('http://localhost:3000/manage', 
                { usf_id }, // Send usf_id in the request body
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log(response.data);
            setReservations(response.data); // Set the fetched reservations to state
        } catch (err) {
            console.error('Error fetching reservations:', err);
            setError('You have not made any computer reservations.');
        }
    };

    const handleDelete = async (usf_id, date_time) => {
        try {
            const token = localStorage.getItem('jwt');
            const formattedDate = new Date(date_time).toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
    
            // Make the DELETE request
            const response = await axios.delete('http://localhost:3000/manage', {
                headers: { Authorization: `Bearer ${token}` },
                data: { usf_id, date_time: formattedDate } // Send usf_id and formatted date
            });
    
            // Check if the response was successful
            if (response.status === 200) {
                // Update the state to remove the deleted reservation
                setReservations(reservations => 
                    reservations.filter(reservation => 
                        reservation.usf_id !== usf_id || 
                        new Date(reservation.date_time).toISOString().split('T')[0] !== formattedDate
                    )
                );
                alert('Reservation deleted successfully!');
            } else {
                throw new Error('Failed to delete reservation'); // Handle non-200 responses
            }
        } catch (err) {
            console.error('Error deleting reservation:', err);
            setError('Error deleting reservation');
            alert('Could not delete reservation. Please try again.'); // Inform the user of the error
        }
    };

    useEffect(() => {
        fetchReservations(); // Fetch reservations on component mount
    }, []);

    return (
        <div className="manage-reservation">
            <h1>Manage Your Reservations</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="reservation-list">
                {reservations.map(reservation => (
                    <div key={reservation.computer_id} className="reservation-card">
                        <div className="reservation-icon">
                            <FaLaptop size={40} /> {/* Display laptop icon */}
                        </div>
                        <div className="reservation-details">
                            <h2>Computer {reservation.computer_id || 'Computer'}</h2> {/* Display computer_id */}
                            <p>Date: {new Date(reservation.date_time).toLocaleDateString()}</p> {/* Only show the date */}
                            <p>Status: {reservation.status}</p>
                        </div>
                        <button 
                            className="delete-button" 
                            onClick={() => handleDelete(reservation.usf_id, reservation.date_time)} // Call delete function with usf_id and date_time
                        >
                            Cancel
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Manage;
