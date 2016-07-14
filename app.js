var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');

require('dotenv').config();

var routes = require('./routes/index');
var users = require('./routes/users');

var tone_analyzer = watson.tone_analyzer({
  username: process.env.TONE_UN,
  password: process.env.TONE_PW,
  version: 'v3',
  version_date: '2016-05-19'
});

var alchemy_language = watson.alchemy_language({
  api_key: process.env.ALCHEMY_KEY
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', routes);
app.use('/users', users);

app.post('/tone', function(req, res, next){
  var content = req.body.content;
  tone_analyzer.tone({ text: content },
    function(err, tone) {
    if (err) {
      console.log(err);
    } else {
      var results = JSON.stringify(tone, null, 2);
      res.setHeader('Content-Type', 'application/json');
      res.send(results);
    }
  });
});

app.post('/sentiment', function(req, res, next){
  var content = req.body.content;
  alchemy_language.sentiment({text: content}, function (err, response) {
    if (err)
      console.log('error:', err);
    else
      var results = JSON.stringify(response, null, 2);
      res.setHeader('Content-Type', 'application/json');
      res.send(results);
  });
});

app.post('/keywords', function(req, res, next){
  var content = req.body.content;
  alchemy_language.keywords({text: content}, function (err, response) {
    if (err)
      console.log('error:', err);
    else
      var results = JSON.stringify(response, null, 2);
      res.setHeader('Content-Type', 'application/json');
      res.send(results);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
