const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:3001', 

}));
app.use(bodyParser.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function connectToDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to MySQL");
        return connection;
    } catch (error) {
        console.error("Error connecting to MySQL:", error);
        process.exit(1);
    }
}

let db;
connectToDB().then((connection) => (db = connection));

let tokenBlacklist = [];

function isValidUsfId(usf_id) {
    return /^U\d{8}$/.test(usf_id);
}

function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@usf\.edu$/.test(email);
}

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token || tokenBlacklist.includes(token)) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.post("/register", async (req, res) => {
    const { usf_id, first_name, last_name, usf_mail, usf_role, password } = req.body;
    if (!isValidUsfId(usf_id)) {
        return res.status(400).send("Wrong USF ID format");
    }
    if (!isValidEmail(usf_mail)) {
        return res.status(400).send("Wrong email format");
    }

    try {
        const [emailCheck] = await db.execute(
            "SELECT * FROM user_information WHERE usf_mail = ?",
            [usf_mail]
        );
        if (emailCheck.length > 0) {
            return res.status(400).send("This email is already associated with another account.");
        }

        const hashed_password = await bcrypt.hash(password, 10);
        await db.execute(
            "INSERT INTO user_information (usf_id, first_name, last_name, usf_mail, usf_role, password) VALUES (?, ?, ?, ?, ?, ?)",
            [usf_id, first_name, last_name, usf_mail, usf_role, hashed_password]
        );
        res.status(201).send({ message: "Sign up successfully" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).send("This USF ID is already associated with another account.");
        }
        console.error("Error:", error);
        res.status(500).send("Error");
    }
});

app.post("/login", async (req, res) => {
    const { usf_mail, password } = req.body;
    try {
        const [results] = await db.execute(
            "SELECT * FROM user_information WHERE usf_mail = ?",
            [usf_mail]
        );
        if (results.length === 0) {
            return res.status(400).send("Email or password is incorrect");
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Email or password is incorrect");
        }

        // Lấy role của người dùng
        const userRole = user.usf_role; // Giả sử trường role trong bảng là 'role'
        
        console.log(user);
        const token = jwt.sign(
            { usf_id: user.usf_id, usf_role: userRole }, // Thêm role vào payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Log in successfully", token });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error");
    }
});


app.post("/logout", authenticateToken, (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        tokenBlacklist.push(token); 
    }
    res.status(200).send("Logged out successfully");
});

app.post("/reserve", authenticateToken, async (req, res) => {
    const { date, computer_id } = req.body;
    const usf_id = req.user.usf_id;

    if (!usf_id || !date || !computer_id) {
        return res.status(400).send("Missing required parameters.");
    }

    try {
        const reservationDate = new Date(date);
        
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const currentDateFormatted = `${year}-${month}-${day}`;

        const currentHour = now.getHours();
        const cutoffHour = 17; // 5 PM in 24-hour format

        if (reservationDate.toISOString().split('T')[0] === currentDateFormatted) {
            if (currentHour >= cutoffHour) {
                return res.status(400).send({ message: "Reservations for today can only be made before 5 PM." });
            }
        }

        // Check if the reservation date is on a Sunday or Monday
        const reservationDay = reservationDate.getUTCDay();
        if (reservationDay === 0 || reservationDay === 1) {
            return res.status(400).send({ message: "Reservations cannot be made on Sundays or Mondays." });
        }

        // Check for active reservations
        const [activeReservations] = await db.execute(
            "SELECT * FROM reservation WHERE usf_id = ? AND date_time >= CURDATE()",
            [usf_id]
        );

        if (activeReservations.length > 0) {
            return res.status(400).send({ message: "You have an active reservation. Please use it before making a new one." });
        }

        // Insert the new reservation
        await db.execute(
            `INSERT INTO reservation (usf_id, date_time, status, computer_id) 
             VALUES (?, ?, 'pending', ?)`,
            [usf_id, date, computer_id]
        );

        res.status(201).send({ message: "Reservation successfully made and is pending." });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error processing reservation.");
    }
});







app.post('/available-computers', authenticateToken, async (req, res) => {
    const { date } = req.body;
    if (!date) {
        return res.status(400).send("Date is required.");
    }

    try {
        const [availableComputers] = await db.execute(
            `SELECT * FROM computers 
             WHERE computer_id NOT IN (
                 SELECT computer_id FROM reservation WHERE date_time = ?
             )`,
            [date]
        );

        res.status(200).json(availableComputers);
    } catch (error) {
        console.error('Error fetching available computers:', error);
        res.status(500).send("Error fetching available computers.");
    }
});


app.post('/manage', authenticateToken, async (req, res) => {
    const userUsfId = req.body.usf_id; // Access usf_id from the request body

    // Check if usf_id is provided
    if (!userUsfId) {
        return res.status(400).json({ message: 'usf_id is required.' });
    }

    try {
        const [results] = await db.execute(
            `SELECT * FROM reservation 
             WHERE usf_id = ?`, // Use placeholder for parameter binding
            [userUsfId] // Bind userUsfId to the placeholder
        );



        // Check if results are found
        if (results.length > 0) {
            // If reservations are found, return them
            res.status(200).json(results);
        } else {
            // If no reservations are found, send an appropriate message
            res.status(404).json({ message: 'No reservations found for this usf_id.' });
        }
    } catch (err) {
        console.error('Error fetching reservations:', err);
        res.status(500).json({ message: 'Error fetching reservations' });
    }
});

app.delete('/manage', authenticateToken, async (req, res) => {
    const { usf_id, date_time } = req.body; // Get usf_id and date from the request body
    const query = 'DELETE FROM reservation WHERE usf_id = ? AND date_time = ?'; // SQL query to delete the reservation
    try {
        const [results] = await db.execute(query, [usf_id, date_time]);
        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Reservation deleted successfully' });
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (err) {
        console.error('Error deleting reservation:', err);
        res.status(500).json({ message: 'Error deleting reservation' });
    }
});

app.get('/dashboard', async (req, res) => {
    const getLocalDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
        const date = String(today.getDate()).padStart(2, '0'); // Pad the date with leading zero if needed
        return `${year}-${month}-${date}`; // Format as 'YYYY-MM-DD'
    };
    
    // Use the function to get the current date
    const date = getLocalDate();
    // Format date as 'YYYY-MM-DD'
    console.log(date)
    const query = `
        SELECT 
    c.computer_id,
    CASE 
        WHEN r.computer_id IS NOT NULL AND r.date_time = ? THEN 'reserved' 
        ELSE 'available' 
    END AS status
FROM 
    computers c
LEFT JOIN 
    reservation r ON c.computer_id = r.computer_id 
ORDER BY 
    c.computer_id;


    `;

    try {
        const [results] = await db.execute(query, [date]);
        console.log(results);
        res.status(200).json(results); 
    } catch (err) {
        console.error('Error fetching computer statuses:', err);
        res.status(500).json({ message: 'Error fetching computer statuses' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Link: http://localhost:${PORT}`);
});


