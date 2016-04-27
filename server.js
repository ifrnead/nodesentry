'use strict';
const express = require('express');

// App initialization
var app = express();

// Handling static contents
app.use('/public', express.static('public'));

// Exposing methods
app.get('/', (req, res) => {
  res.status(200).send("Hello World!");
});

// Handling server error (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Handling file not found error (404)
app.use((req, res, next) => {
  res.status(404).send('Sorry can\'t find that!');
});

// Exposing service on port 7000
app.listen(7000, () => {
  console.log("Server running at http://localhost:7000/");
});
