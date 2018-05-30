var server = require('../server.js');

var ratingsRef = server.db.ref("ratings");

//Posts a new Rating
// need to somehow update ratings fields in listings and transactions
function newRating(req, res){
    ratingsRef.push({
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
function getRating(req, res) {
    let id = req.params.id;
    ratingsRef.child(id).once("value", snapshot => {
        if(snapshot.val() == null) {
            res.send("User id error");
        } else {
            res.json(snapshot.val())
        }
    });
}
