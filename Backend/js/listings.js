//import db from "../server.js"
var server = require('../server.js');

var listingsRef = server.db.ref("listings");

function getListings(req, res) {
    listingsRef.once("value", (snapshot, prevChildKey) => {
        res.json(snapshot.val())
    });
}

function getListing(req, res) {
    let id = req.params.id;
    listingsRef.child(id).once("value", function(snapshot) {
        if(snapshot.val() == null) {
            res.send("User id error");
        } else {
            res.json(snapshot.val())
        }
    });
}

function newListing(req, res) {
    listingsRef.push({
        itemName: req.body.itemName,
        tags: req.body.tags,
        ownerID: '?',
        price: req.body.price,
        availability: 1,
        endTime: req.body.endTime,
        pictureURL: '?',
        description: req.body.description
    }, function(err) {
        if(err){
            res.send(err)
        }
    });
}

function updateListing(req, res) {
    res.json();
}

function deleteListing(req, res) {
    let id = req.params.id;
    listingsRef.child(id).remove(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.json();
        }
    });
}

module.exports = {getListings, getListing, newListing, updateListing, deleteListing}
