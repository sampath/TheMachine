/* Base Setup */
var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');

/* Get Route Handlers */
var users = require('./users.js');
var listings = require('./listings.js');

/* connect to firebase project here */
var config = {
  apiKey: "AIzaSyAa7xJzMvvYSZbBbfaTb3-k4eSBqzAYYsI",
  authDomain: "flick-b0e2c.firebaseapp.com",
  databaseURL: "https://flick-b0e2c.firebaseio.com",
  storageBucket: "flick-b0e2c.appspot.com",
};

firebase.initializeApp(config);
var db = firebase.database();

var app = express();

var router = express.Router();

router.get('/', function(req, res) {

});

// User requests
router.route('/users')
    .get(users.getUsers)
    .post(users.newUser);
router.route('/users/:id')
    .get(users.getUser)
    .patch(users.updateUser)
    .delete(users.deleteUser);

// Listing requests
router.route('/listings')
    .get(listings.getListings)
    .post(listings.newListing);
router.route('listings/:id')
    .get(listings.getListing)
    .patch(listings.updateListing)
    .delete(listings.deleteListing);

app.use('/', router);

module.exports = {app, db};

app.listen(3000, ()=> {
    console.log('server started at http://localhost:3000/');
});
