


# GameSpot Booking System

## Overview

GameSpot Booking System is a comprehensive web application designed for users to efficiently reserve gaming machines in a gaming lab. The application allows both individual and group bookings, providing a seamless user experience from registration to reservation management. With a focus on security and usability, the system utilizes modern web technologies to deliver a robust booking solution.

## Features

- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT) for session management and bcrypt for password hashing.
- **Individual and Group Reservations**: Users can book machines for themselves or enter group details for collective reservations.
- **Date and Time Selection**: Users can select specific dates and times for their bookings.
- **Real-Time Machine Availability**: Only machines that are available for booking will be displayed.
- **Responsive Design**: The application is designed to work seamlessly across various devices, including desktops, tablets, and smartphones.
- **Admin Dashboard**: Admins can manage user accounts and machine availability.

## Technologies Used

- **Frontend**: 
  - React.js for building user interfaces.
  - CSS for styling and layout.
  - Axios for making HTTP requests to the backend.

- **Backend**: 
  - Node.js and Express.js for server-side application logic.
  - MySQL for data storage and management.
  - JSON Web Tokens (JWT) for secure user authentication.
  - bcrypt for hashing passwords.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: You can download it from [Node.js official website](https://nodejs.org/).
- **MySQL**: Install MySQL server from [MySQL official website](https://www.mysql.com/).

### Installation Steps

1. **Clone the Repository**:
   Open your terminal and run the following command to clone the repository:
   ```bash
   git clone https://github.com/dn-cuong/GameSpot-Booking.git
   cd GameSpot-Booking
   ```

2. **Set Up the Backend**:
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install the required dependencies:
     ```bash
     npm install
     ```

3. **Set Up the Frontend**:
   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install the frontend dependencies:
     ```bash
     npm install
     ```

4. **Database Setup**:
   - Open your MySQL client and create a new database for the application:
     ```sql
     CREATE DATABASE gamespot_booking;
     ```
   - Import the SQL schema provided in the `backend` directory to set up the necessary tables.

5. **Environment Variables**:
   - Create a `.env` file in the `backend` directory and add the following environment variables:
     ```plaintext
     DB_HOST=localhost
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=gamespot_booking
     JWT_SECRET=your_jwt_secret
     ```
   - Replace `your_mysql_username`, `your_mysql_password`, and `your_jwt_secret` with your actual MySQL username, password, and a secure secret for JWT.

6. **Start the Backend Server**:
   - Navigate back to the `backend` directory if not already there:
     ```bash
     cd ../backend
     ```
   - Start the backend server:
     ```bash
     node server.js
     ```

7. **Start the Frontend Application**:
   - Open a new terminal window or tab, navigate to the `frontend` directory, and start the frontend application:
     ```bash
     cd ../frontend
     npm start
     ```

## Usage

1. **Accessing the Application**:
   - Open your web browser and navigate to `http://localhost:3000`.

2. **User Registration and Login**:
   - Users can register for a new account or log in to an existing account using the provided forms.

3. **Making a Reservation**:
   - Once logged in, users can choose to reserve a gaming machine by selecting the date and time.
   - For group bookings, users must enter the group size and member details.

4. **Managing Reservations**:
   - Users can view their reservations, cancel bookings, and make new reservations as needed.

5. **Admin Dashboard** (if applicable):
   - Admins can log in to manage user accounts and machine availability.

## Security Considerations

- Passwords are securely hashed using bcrypt before being stored in the database.
- JWT is used to maintain user sessions, ensuring that only authenticated users can access certain features.

## Contributing

Contributions to the GameSpot Booking System are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push your branch:
   ```bash
   git push origin my-feature-branch
   ```
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the documentation for React.js, Node.js, Express.js, and MySQL.
- Thank you to everyone who has contributed to this project.
```

Feel free to modify any section or add additional details based on your project's specifics!
