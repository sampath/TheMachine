var database = require('./db.js');
var reviewsRef = database.db.ref("reviews");
var usersRef = database.db.ref("users");
var listingsRef = database.db.ref("listings");

//Posts a new Rating
// need to somehow update ratings fields in listings and transactions
function newReview(req, res){
    var stars = req.body.stars;
    //TODO:Get the rating specific to the userID
    //TODO: renter submit, change owner and listing avgRating
    //TODO: owner submit, change renter's average rating
    var renterAvgRating = null;
    var numRenterRatings = null;
    var ownerAvgRating = null;
    var numOwnerRatings = null;
    var listingAvgRating = null;
    var numListingRatings = null;

    if(req.body.isOwner) {
        // gets the snapshot of the user with the inputted userID
        usersRef.child(req.body.userID).once("value").then(function(snapshot) {

            // saves the values of the avg rating and number of ratings for renters into the values
            renterAvgRating = snapshot.child("renterAvgRating").val();
            numRenterRatings = snapshot.child("numRenterRatings").val();

            // adds 1 to the number of ratings
            numRenterRatings += 1;

            // calculates the new average rating
            renterAvgRating = ((renterAvgRating * (numRenterRatings - 1)) + stars) / numRenterRatings;

            // updates the updated rating and number of ratings for the renter
            usersRef.child(req.body.userID).child('numRenterRatings').set(numRenterRatings);
            usersRef.child(req.body.userID).child('renterAvgRating').set(renterAvgRating);
        });
    } else {
        usersRef.child(req.body.userID).once("value").then(function(snapshot) {
            ownerAvgRating = snapshot.child("ownerAvgRating").val();
            numOwnerRatings = snapshot.child("numOwnerRatings").val();
            numOwnerRatings += 1;
            ownerAvgRating = ((ownerAvgRating * (numOwnerRatings - 1)) + stars) / numOwnerRatings;
            usersRef.child(req.body.userID).child('numOwnerRatings').set(numOwnerRatings);
            usersRef.child(req.body.userID).child('ownerAvgRating').set(ownerAvgRating);
        });
        listingsRef.child(req.body.listingID).once("value").then(function(snapshot) {
            listingAvgRating = snapshot.child("avgRating").val();
            numListingRatings = snapshot.child("numListingRatings").val();
            numListingRatings += 1;
            listingAvgRating = ((listingAvgRating * (numListingRatings - 1)) + stars) / numListingRatings;
            listingsRef.child(req.body.listingID).child('numListingRatings').set(numListingRatings);
            listingsRef.child(req.body.listingID).child('avgRating').set(listingAvgRating);
        });
    }

    //TODO: Calculate the new rating and add patch it
    reviewsRef.push({
        listingID : req.body.listingID,
        userID : req.body.userID, // userID of the person you are reviewing
        isOwner : req.body.isOwner, //is person who is doing the review the owner or renter
        stars : req.body.stars,
        price : req.body.price,
        date : Date.now(),
        title : req.body.title,
        comment : req.body.comment
    }, err => {
        if(err){
            res.send(err)
        }
    });
}

//Gets the ratings for a user/listing
function getReview(req, res) {
    let id = req.params.id;
    console.log(id);
    reviewRef.child(id).once("value", snapshot => {
        if(snapshot.val() == null) {
            res.send("User id error");
        } else {
            res.json(snapshot.val())
        }
    });
}

module.exports = {getReview, newReview};
