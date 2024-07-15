const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Set up body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Create connection pool to handle multiple connections
const db = mysql.createPool({
  connectionLimit: 10, // adjust as per your requirement
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database');    connection.release(); // release the connection
  }
});

// Route to save content
app.post('/save', (req, res) => {
  const { content } = req.body;
  console.log('Content received:', content); // Log received content

  const query = 'INSERT INTO EditorContent (content) VALUES (?)';

  db.query(query, [content], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error saving content');
    } else {
      console.log('Content saved successfully');
      res.send('Content saved successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
