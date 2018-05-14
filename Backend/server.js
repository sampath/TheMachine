/* Base Setup */
var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');

/* Get Route Handlers */
import {getUsers, getUser, newUser, updateUser, deleteUser} from "./js/users.js";
import {getListings, getListing, newListing, updateListing, deleteListing} from "./js/listings.js";

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
    .get(getUsers)
    .post(newUser);
router.route('/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

// Listing requests
router.route('/listings')
    .get(getListings)
    .post(newListing);
router.route('listings/:id')
    .get(getListing)
    .patch(updateListing)
    .delete(deleteListing);

app.use('/', router);

export default {db}

app.listen(3000, ()=> {
    console.log('server started at http://localhost:3000/');
});
