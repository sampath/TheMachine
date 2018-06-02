var users = require('./users.js');
var listings = require('./listings.js');
var reviews = require('./reviews.js');
var alerts = require('./alerts.js');
var transactions = require('./transactions.js');


function createRoutes (router) {
	router.get('/', function(req, res) {
    	res.json({"output": "go elsewhere"});
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
	    .get(listings.getAllListings)
	    .post(listings.newListing)

	router.route('/listings/:id')
	    .get(listings.getListing)
	    .patch(listings.updateListing)
	    .delete(listings.deleteListing);

	// Reviewss requests
	router.route('/reviews/:id')
	    .get(reviews.getReview);
	router.route('/reviews')
	    .post(reviews.getReview);

	//Alerts requests
	router.route('/alerts/:id')
	    .get(alerts.getAlert)
	    .post(alerts.postAlert);

	//Transactions requests
	router.route('/transactions/:id')
	    .get(transactions.getTransaction)
	    .post(transactions.newTransaction)
	    .patch(transactions.updateTransaction)
		.delete(transactions.deleteTransaction);
	router.route('/transactions/')
	    .get(transactions.getTransaction)
	    .post(transactions.newTransaction)
	    .patch(transactions.updateTransaction)
	    .delete(transactions.deleteTransaction);

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
	router.route('test/listings/:id')
	    .get(listings.getListing)
	    .patch(listings.updateListing)
	    .delete(listings.deleteListing);
	router.route('/test/listings')
	    .get(listings.getAllListings)
	    .post(listings.newListing)
	router.route('/test/reviews')
	    .post(reviews.newReview);
	router.route('/test/transactions')
	    .post(transactions.newTransaction)
	    .get(transactions.getTransaction)
}

module.exports = {createRoutes};