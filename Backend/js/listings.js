//import db from "../server.js"
var server = require('../server.js');

var listingsRef = server.db.ref("listings");

function getListings(req, res) {
    let queryRef = listingsRef.orderByChild(req.query.orderBy) // add default key to order by
        .startAt(req.query.minVal || 0)
        .endAt(req.query.maxVal || 1000000);
    if (req.query.onlyAvailable) {
        queryRef = queryRef.equalTo(1, 'availability')
    }
    // Search descriptions for keyword matches
    queryRef.once("value",(snapshot, prevChildKey) => {
        let index = 0;
        let listingArray = snapshot.val();
        snapshot.val().forEach(listing => {
            // if we want to search tags
            //let wordsToSearch = listing.child('tags')
            let wordsToSearch = listing.child('description').split(' ');
            wordsToSearch[wordsToSearch.length - 1] = wordsToSearch[description.length - 1].split('.')[0];
            if (!wordsToSearch.some(t => req.query.searchWords.includes(t))) {
                listingArray = listingArray.splice(index, 1);
                index--;
            }

            index++;
        });
        res.json(listingArray);
    });
}

function getListing(req, res) {
    let id = req.params.id;
    listingsRef.child(id).once("value", snapshot => {
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
        description: req.body.description,
        endTime: '?',
        pictureURL: '?',
        avgRating: 0.0
    }, err => {
        if(err){
            res.send(err)
        }
    });
}

function updateListing(req, res) {
    let id = req.params.id;
    let listing = {};
    req.body.keys.forEach((param) => {
        listing[param] = req.body[param];
    });
    listingsRef.child(id).update(listing, function(err) {
        if(err) {
            res.send(err)
        }
    });
    res.json();
}

function deleteListing(req, res) {
    let id = req.params.id;
    listingsRef.child(id).remove(err => {
        if(err) {
            res.send(err);
        } else {
            res.json();
        }
    });
}

module.exports = {getListings, getListing, newListing, updateListing, deleteListing};
