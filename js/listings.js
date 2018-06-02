//import db from "../server.js"
var server = require('./db.js');
var listingsRef = server.db.ref("listings");

function getAllListings(req, res){
    listingsRef.once("value", (snapshot, prevChildKey) => {
        res.json(snapshot.val())
    });
}

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

    uploadFile(""+__dirname+"/Test.jpg", metadata, pushedRef.key);
}

function updateListing(req, res) {
    let id = req.params.id;
    let listing = {};
    console.log(typeof req.body);
    for (property in req.body) {
        if (req.body.property != null)
            listing[property] = req.body.property;
    };
    console.log(id);
    let listing_node = listingsRef.child(id);
    console.log(listing_node);
    listingsRef.child(id).update(listing, function(err) {
        if(err) {
            res.send(err)
        }
    });
    console.log(listingsRef.child(id))
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

module.exports = {getListings, getListing, newListing, updateListing, deleteListing, getAllListings};