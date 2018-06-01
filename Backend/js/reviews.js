var database = require('./db.js');
var reviewsRef = database.db.ref("reviews");

//Posts a new Rating
// need to somehow update ratings fields in listings and transactions
function newReview(req, res){
    var stars = req.body.stars;
    //TODO:Get the rating specific to the userID

    //TODO: Calculate the new rating and add patch it
    reviewsRef.push({
        listingID : '?',
        userID : '?',
        isOwner : '?',
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
