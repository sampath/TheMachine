//import db from "../server.js"
var server = require('./db.js');
var listingsRef = server.db.ref("listings");

function getAllListings(req, res){
    listingsRef.once("value", (snapshot, prevChildKey) => {
        res.json(snapshot.val())
    });
}

function getListings(req, res) {
    let queryRef = listingsRef.orderByChild(req.body.orderBy); // add default key to order by
    if (req.body.onlyAvailable) {
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
            if (!wordsToSearch.some(t => req.body.searchWords.includes(t))) {
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
        console.log(snapshot.val());
        if(snapshot.val() == null) {
            res.send("User id error");
        } else {
            res.json(snapshot.val())
        }
    });
}

/* Function for uploading file using bucket */
function uploadFile(file, metadata, id) {
    var options = {
        destination: file,
        resumable: false,
        metadata: {
            metadata: metadata
        }
    };

    server.bucket.upload(file, options, function(err, remoteFile) {
        if (!err) {
            console.log("Uploaded!");
            remoteFile.getDownloadURL
            remoteFile.getSignedUrl({
                action: 'read',
                expires: '03-17-2025'
              }).then(signedUrls => {
                listingsRef.child(id).child('pictureURL').set(signedUrls[0]);
              });
        } else {
            console.log(err);
        }
    })
}

function newListing(req, res) {

    var metadata = {
        id: '1234'
    };

    var pushedRef = listingsRef.push({
        itemName: req.body.itemName,
        tags: req.body.tags,
        ownerID: req.body.ownerID,
        price: req.body.price,
        availability: 1,
        description: req.body.description,
        // endTime: '?',
        pictureURL: '?',
        avgRating: 0.0,
        numListingRatings: 0

    }, err => {
        if(err){
            res.send(err)
        }
    });

    uploadFile(""+"https://firebasestorage.googleapis.com/v0/b/flick-b0e2c.appspot.com/o/C%3A%5CUsers%5Cdell%5CDesktop%5CCSE110%5CTheMachine%5CBackend%5Cjs%2FTest.jpg?alt=media&token=a08f726d-163d-4d09-9006-5396fe900d59", metadata, pushedRef.key);
}

/*
 * Working patch callback method
 */
function updateListing(req, res) {
    console.log("in update function");
    console.log("printing req.params.id: " + req.params.id);
    let id = req.params.id;
    listingsRef.child(id).once("value", snapshot => {
        var listing = snapshot.val();
        for (property in req.body) {
            console.log(req.body[property] + " " + property);
            if (req.body[property] != '') {
                listing[property] = req.body[property];
            }
        }
        listingsRef.child(id).update(listing, err => {
            if(err) {
                res.send(err);
            } else {
                res.send("Successfully Updated")
            }
        });
    });
}

function deleteListing(req, res) {
    console.log("in delete function");
    console.log("printing req.params.id: " + req.params.id);
    let id = req.params.id;
    listingsRef.child(id).remove(err => {
        if(err) {
            res.send(err);
        } else {
            res.json();
        }
    });
}

module.exports = {getListings, getListing, newListing, updateListing, deleteListing, getAllListings};