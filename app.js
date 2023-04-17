// Import dependencies
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const sql = require('./db.js')
app.use(bodyParser.json());

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

// define route for fetching a random sprite from the sprite_labels table
app.get('/get-random-sprite', (req, res) => {
  // select a random sprite from the sprite_labels table
  const query = 'SELECT * FROM sprite_labels WHERE user_label IS NULL AND is_unknown IS NULL ORDER BY RAND() LIMIT 1';
  sql.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    // send the random sprie as JSON data
  res.json(results[0]);
  });
});

// Handle POST request to insert an annotation
app.post('/insert-annotation', (req, res) => {
  // Get the data from the POST request
  console.log(req.body)
  const spriteId = req.body.sprite_db_id;
  const annotation = req.body.annotation;
  const is_unknown = req.body.is_unknown;
  const is_tile = req.body.is_tile;
  const color_in = (req.body.color_in == "none" ? null : req.body.color_in);
  const sprite_hex = req.body.sprite_hex;
  console.log("INSERTING:")
  console.log("SPRITE DB ID:", spriteId);
  console.log("SPRITE_HEX:", sprite_hex);
  console.log("ANNOTATION:", annotation);
  console.log("IS_UNKNOWN:", is_unknown);
  console.log("IS_TILE:", is_tile);
  console.log("COLOR:", color_in);
  
  // Insert the annotation into the database
  // const query = 'INSERT INTO user_levels_annotated (ANNOTATION_ID, LEVEL_ID, ASCII_MAP, MAP_SIZE, TIME_MADE, ANNOTATION, ANN_AUTHOR) VALUES (null, ?, ?, ?, ?, ?, ?)';

  const query = 'UPDATE sprite_labels SET user_label = ?, is_unknown = ?, is_tile = ?, color = ?, timestamp = CURRENT_TIMESTAMP WHERE SPRITE_DB_ID = ?;';

  sql.query(query, [annotation, is_unknown, is_tile, color_in, spriteId], (err, result) => {
    if (err) {
      throw err;
    }
    // Send a success message as a JSON object
    res.json({ message: 'Annotation inserted successfully' });
  });
})