const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
require('dotenv').config();
require('./config/database');

const app = express();

app.use(logger('dev'));
// Process data in body of request if 
// Content-Type: 'application/json'
// and put that data on req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

// middleware that adds the user object from a JWT to req.user
app.use(require('./config/checkToken'));


app.use('/api/users', require('./routes/api/users'));

// Protect the api routes below from anon users
const ensureLoggedIn = require('./config/ensureLoggedIn');

// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/projects',  require('./routes/api/projects'));
// app.use('/api/blog', require('./routes/api/post'));

// "catch-all" route that will match all GET requests
// that don't match an API route defined above
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
const port = process.env.PORT || 3001;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`);
});