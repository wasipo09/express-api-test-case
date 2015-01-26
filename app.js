//Dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var apiRoute = require('./routes/api')(express, app);
var config = require('./config');

//DB Connection
mongoose.connect(config.mongodb);

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  next();
});
app.use('/api', apiRoute);

//Default route
app.get('*', function(req, res) {
  res.send('Welcome to the home page!');
});

//Exported to server file
module.exports = app;
