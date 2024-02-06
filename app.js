'use strict';
require('dotenv').config();
const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
app.use('/', require('./routes/root')());
app.use('/profiles', require('./routes/profiles')());
app.use('/users', require('./routes/users')());
app.use('/comments', require('./routes/comments')());

const conn = require('./db/conn');

const startServer = async (port = process.env.PORT || 3000) => {
  await conn();
  const server = app.listen(port);
  console.log('Express started. Listening on %s', port);
  return server;
};

module.exports = startServer; // export the function
