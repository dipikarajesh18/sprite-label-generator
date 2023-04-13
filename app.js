// Import dependencies
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const sql = require('./db.js')
app.use(bodyParser.json());

// from https://github.com/bezkoder/nodejs-express-mysql/blob/master/app/models/db.js

// const connection = mysql.createPool({
//   host: 'us-cdbr-east-06.cleardb.net',
//   user: 'b35ad572883ea6',
//   password: '3c164730',
//   database: 'heroku_539ff7e32e2cf6f'
// });

// module.exports = connection;


// Set up MySQL connection
// mysql://b35ad572883ea6:3c164730@us-cdbr-east-06.cleardb.net/heroku_539ff7e32e2cf6f?reconnect=true
// const connection = mysql.createConnection({
//   host: 'us-cdbr-east-06.cleardb.net',
//   user: 'b35ad572883ea6',
//   password: '3c164730',
//   database: 'heroku_539ff7e32e2cf6f'
// });

// Connect to MySQL
// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to MySQL database');
// });

// Set up Express.js server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// define route for root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/index.html'));
});

app.get('/style.css', (req, res) => {
  res.type('text/css');
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

// define route for fetching a random level from the user_levels table
app.get('/get-random-level', (req, res) => {
  // select a random level from the user_levels table
  const query = 'SELECT * FROM user_levels_compressed ORDER BY RAND() LIMIT 1';
  sql.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    // send the random level as JSON data
    res.json(results[0]);
  });
});

// Handle POST request to insert an annotation
app.post('/insert-annotation', (req, res) => {
  // Get the data from the POST request
  console.log(req.body)
  const levelId = req.body.level_id;
  const annotation = req.body.annotation;
  const ascii_map = req.body.ascii_map
  const map_size = req.body.map_size
  const username = req.body.uname
  console.log("INSERTING:")
  console.log("Level ID:", levelId);
  console.log("ASCII_MAP:", ascii_map);
  console.log("MAP_SIZE:", map_size);
  console.log("ANNOTATION:", annotation);
  
  // Insert the annotation into the database
  const query = 'INSERT INTO user_levels_annotated (ANNOTATION_ID, LEVEL_ID, ASCII_MAP, MAP_SIZE, TIME_MADE, ANNOTATION, ANN_AUTHOR) VALUES (null, ?, ?, ?, ?, ?, ?)';
  sql.query(query, [levelId, ascii_map, map_size, 'CURRENT_TIMESTAMP', annotation, username], (err, result) => {
    if (err) {
      throw err;
    }
    // Send a success message as a JSON object
    res.json({ message: 'Annotation inserted successfully' });
  });
});