/* Base Setup */
var express = require('express');
var firebase = require("firebase");
var bodyParser = require('body-parser');

/* connect to firebase project here */
var config = {
  apiKey: "AIzaSyAa7xJzMvvYSZbBbfaTb3-k4eSBqzAYYsI",
  authDomain: "flick-b0e2c.firebaseapp.com",
  databaseURL: "https://flick-b0e2c.firebaseio.com",
  storageBucket: "flick-b0e2c.appspot.com",
};
firebase.initializeApp(config);

var app = express();

