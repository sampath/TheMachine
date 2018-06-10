//import db from "../server.js"
var server = require('./db.js');
var listingsRef = server.db.ref("listings");
var stream = require("stream");

function getAllListings(req, res){
    listingsRef.once("value", (snapshot) => {
        res.json(snapshot.val())
    });
}

function getListings(req, res) {
    var queryRef = listingsRef.orderByChild('availability');
    if (req.query.onlyAvailable) {
        queryRef = queryRef.equalTo(1);
    }
    var maxPrice = req.query.maxPrice;
    var minPrice = req.query.minPrice;
    var searchWords = req.query.searchWords.toLowerCase().split(' ');

    // Search descriptions for keyword matches
    queryRef.once("value",(snapshot) => {
        let listingArray = snapshot.val();
        for(var i=0; i<Object.keys(listingArray).length; ) {
            let listing = listingArray[Object.keys(listingArray)[i]];
            let wordsToSearch = listing['description'] + ' ' + listing['itemName'];
            wordsToSearch = wordsToSearch.toLowerCase().split(' ');
            if (!wordsToSearch.some(t => searchWords.includes(t.toLowerCase())) || listing['price'] < minPrice || listing['price'] > maxPrice) {
                delete listingArray[Object.keys(listingArray)[i]];
            } else {
                i++;
            }
        }
        res.json(listingArray);
    });
}

function getKeyword(req, res){
  let id = req.params.id;
  listingsRef.orderByChild('itemName').equalTo(id+"").on("value", function(snapshot){
      if(snapshot.val==null){
        res.send("No object found");
      } else {
        res.json(snapshot.val());
      }
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

/*Function uploads a picture to the storage*/
function uploadPicture(base64, postId, uid, err) {
  if(!err){
    let bufferStream = new stream.PassThrough();
    bufferStream.end(new Buffer.from(base64, 'base64'));

    // Retrieve default storage bucket
    let bucket = server.bucket;

    // Create a reference to the new image file
    let file = bucket.file(`/images/${uid}_${postId}.jpg`);

    bufferStream.pipe(file.createWriteStream({
      metadata: {
        contentType: 'image/jpeg'
      }
    }))
    .on('error', error => {
      reject(`news.provider#uploadPicture - Error while uploading picture ${JSON.stringify(error)}`);
    })
    .on('finish', (uploadedFile) => {
      // The file upload is complete.
      //Adding the URL to the database
       file.getSignedUrl({
          action: 'read',
          expires: '03-17-2025'
        }).then(signedUrls => {
          listingsRef.child(uid).child('pictureURL').set(signedUrls[0]);
        });

    });
    } else {//}
      console.log(err);
    }
};

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
    uploadPicture(req.body.picturePath+"",req.body.itemName+"",pushedRef.key);
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
        }
    });
}

function getUserListings(req,res){
    let id = req.params.id;
    let queryRef = listingsRef.orderByChild("ownerID").equalTo(id);

    var listingsArray = [];

    queryRef.once("value").then(function(snapshot) {
        listingsArray = snapshot.val();
        res.json(listingsArray);
    });
}

module.exports = {getListings, getListing, newListing, updateListing, deleteListing, getAllListings, getUserListings, getKeyword};
