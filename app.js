
import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 5000;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Sarthak@2002',
  database: 'hospital',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// API endpoint for new patient registration
app.post('/register-patient', async (req, res) => {
    try {
      const {
        name,
        address,
        email,
        phone,
        password,
        psychiatristId,
        hospitalId
      } = req.body;
  
      // Validation
      if (!name || !address || !email || !phone || !password || !psychiatristId || !hospitalId) {
        return res.status(400).json({ error: 'All fields are mandatory' });
      }
  
      if (address.length < 10) {
        return res.status(400).json({ error: 'Address should be at least 10 characters' });
      }
          // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
        }

        // Phone number validation (assuming a simple check for 10 digits)
        if (!/^\d{10,}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number' });
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/;
        if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Password must contain one upper character, one lower character, and a number. It should be between 8 and 15 characters long.' });
        }
  
      // Insert validated data into the database
      const [result] = await pool.query(
        'INSERT INTO patients (name, address, email, phone, password, psychiatrist_id, hospital_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, address, email, phone, password, psychiatristId, hospitalId]
      );
  
      if (result.affectedRows === 1) {
        res.status(201).json({ success: 'Patient registered successfully' });
      } else {
        res.status(500).json({ error: 'Failed to register patient' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// API endpoint to fetch hospital details
app.post('/hospital-details', async (req, res) => {
  try {
    const hospitalId = req.body.hospitalId;

    // Fetch hospital details
    const [hospitalDetails] = await pool.query('SELECT * FROM hospitals WHERE id = ?', [hospitalId]);
    const hospitalName = hospitalDetails[0].name;

    // Fetch psychiatrist details for the hospital
    const [psychiatristDetails] = await pool.query('SELECT * FROM psychiatrists WHERE hospital_id = ?', [hospitalId]);
    const totalPsychiatrists = psychiatristDetails.length;

    // Fetch patient details for the hospital
    const [patientDetails] = await pool.query('SELECT * FROM patients WHERE hospital_id = ?', [hospitalId]);
    const totalPatients = patientDetails.length;

    // Prepare the response
    const response = {
      hospitalName,
      totalPsychiatrists,
      totalPatients,
      psychiatristDetails: psychiatristDetails.map(psychiatrist => ({
        id: psychiatrist.id,
        name: psychiatrist.name,
        patientsCount: patientDetails.filter(patient => patient.psychiatrist_id === psychiatrist.id).length
      }))
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
