'use strict';
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');
const mongoose = require('mongoose');
var helmet = require('helmet');
var routes = require('./routes/api.js');
const nocache = require('nocache')


var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

// Delete this
app.use(nocache())

app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Delete this
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, db) => {
  if (err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successful database connection');
    //Index page (static HTML)
    app.route('/')
      .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
      });

    //For FCC testing purposes
    fccTestingRoutes(app);

    //Routing for API 
    app.use(routes)
    //404 Not Found Middleware
    app.use(function (req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });

    //Start our server and tests!
    app.listen(process.env.PORT || 3000, function () {
      console.log("Listening on port " + process.env.PORT);
      if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
          try {
            runner.run();
          } catch (e) {
            var error = e;
            console.log('Tests are not valid:');
            console.log(error);
          }
        }, 1500);
      }
    });
  }
});



module.exports = app; //for unit/functional testing
