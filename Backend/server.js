/* Base Setup */
var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');

/* Admin SDK Setup */
var admin = require('firebase-admin');

var serviceAccount = require('./credentials.json');

//Firebase config
var config = {
  apiKey: "AIzaSyAa7xJzMvvYSZbBbfaTb3-k4eSBqzAYYsI",
  authDomain: "flick-b0e2c.firebaseapp.com",
  databaseURL: "https://flick-b0e2c.firebaseio.com",
  storageBucket: "flick-b0e2c.appspot.com",
};
firebase.initializeApp(config);

admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://flick-b0e2c.firebaseio.com"
});
console.log("Admin SDK setup complete");

/* Get Route Handlers */
var app = express();
var db = admin.database();
var router = express.Router();

app.use('/', router);

/* Set up Admin Storage Bucket */
const bucket = admin.storage().bucket("flick-b0e2c.appspot.com");
console.log("done");

module.exports= {
	app: app,
    db: db,
    bucket: bucket
};

var users = require('./js/users.js');
var listings = require('./js/listings.js');
var reviews = require('./js/reviews.js');
var alerts = require('./js/alerts.js');
var transactions = require('./js/transactions.js');
console.log("Get route handlers");

router.get('/', function(req, res) {

});

// Set up bodyParser
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));

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
    .get(function(req, res){
			listings.getListings
		})
    .post(function(req, res){
			listings.newListing
		});
router.route('/listings/:id')
    .get(function(req, res){
			listings.getListing
		})
    .patch(function(req, res){
			listings.updateListing
		})
    .delete(function(req, res){
			listings.deleteListing
		});

// Reviewss requests
router.route('/reviews/:id')
	  .get(function(req, res){
			reviews.getReview
		});
router.route('/reviews')
		.post(function(req, res){
			reviews.getReview
		});

//Alerts requests
router.route('/alerts/:id')
		.get(function(req,res){
			alerts.getAlert
		})
		.post(function(req,res){
			alerts.postAlert
		});

//Transactions requests
router.route('/transactions/:id')
		.get(function(req,res){
			transactions.getTransaction
		})
		.post(function(req,res){
			transactions.newTransaction
		})
		.patch(function(req, res){
			transactions.updateTransaction
		})
    	.delete(function(req, res){
			transactions.deleteTransaction
		});

// Test routing
// Go to localhost:3000/test

router.route('/test')
    .get(function(req,res,next){
      res.sendFile(__dirname+'/tester.html');
    });
router.route('/test/users')
	.get(users.getUsers)
    .post(users.newUser);
router.route('/test/users/:id')
    .get(users.getUser)
    .patch(users.updateUser)
    .delete(users.deleteUser);
router.route('/test/listings/:id')
    .get(listings.getListing)
    .patch(listings.updateListing)
    .delete(listings.deleteListing);
router.route('/test/listings')
	.get(listings.getListings)
    .post(listings.newListing);
router.route('/test/reviews')
    .post(reviews.newReview);
router.route('/test/transactions')
    .post(transactions.newTransaction)
    .get(transactions.getTransaction)

app.listen(3000, ()=> {
    console.log('server started at http://localhost:3000/');
});
