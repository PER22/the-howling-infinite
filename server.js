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
app.use('/api/essays', require('./routes/api/essays'));
app.use('/api/blog', require('./routes/api/blog'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/images', require('./routes/api/images'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
const port = process.env.PORT || 3001;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`);
});