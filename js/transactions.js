var database = require('./db.js');
var transactionsRef = database.db.ref("transactions");

// ?renterID=&listingID
function selectRenter(params, res){
    // Deletes all renters interested in the item EXCEPT for given renter
    let renter = params['renterID'];
    let listing = params['listingID'];

    let queryRef = transactionsRef.orderByChild("listingID_closed").equalTo(listing + "_false");

    queryRef.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childRenterID = childSnapshot.child("renterID").val();
            if(childRenterID!=renter){
                _deleteTransaction(childSnapshot.key, res);
            }
        });
    });
}


function getSingleTransaction(req, res) {
    let id = req.params.id;
    transactionsRef.child(id).once("value", function(snapshot) {
        if(snapshot.val() == null) {
            res.send("User id error");
        } else {
            res.json(snapshot.val())
        }
    });
}

// Query strings:
// ?listingID=&closed=
function getTransactions(req, res) {
    let queryRef = transactionsRef.orderByChild("listingID_closed").equalTo(req.query.listingID + "_" + req.query.closed);

    var keyArray = [];

    queryRef.once("value").then(function(snapshot) {
        keyArray = snapshot.val();
        // snapshot.forEach(function(childSnapshot) {
        //     //.child to get renterid
        //     var key = childSnapshot.key;
        //     keyArray.push(key);
        // });
        res.json(keyArray);
    });
}

// ?listingID=&ownerID=&renterID=&price=
function renterInterested(params, res) {

    transactionsRef.push({
        listingID: params['listingID'],
        ownerID: params['ownerID'], //user id of the owner,
        renterID: params['renterID'], //current user,
        price: params['price'],
        startTime: Date.now(),
        endTime: Date.now(),
        ownerConfirmed: false,
        renterConfirmed: true,
        ownerClosed: false,
        renterClosed: false,
        closed: false,
        listingID_closed: params['listingID'] + "_" + false,
        listingID_renterID_closed: params['listingID'] + "_" + params['renterID'] + "_" + false

    }, function(err) {
        if(err){
            res.send(err)
        }
    });
}

function _deleteTransaction(transactionID, res) {
    let id = transactionID;
    transactionsRef.child(id).remove(function(err) {
        if(err) {
            res.send(err);
        }
    });
}

function renterConfirm(params, res) {
    let transactionID = params['transactionID'];
    let renterConfirmed = {renterConfirmed: true};
    transactionsRef.child(transactionID).update(renterConfirmed, err => {
        if (err) {
            res.send(err)
        } else {
            res.send('Renting period started.')
        }
    });
}

function renterClose(params, res) {
    let renter = params['renterID'];
    let listing = params['listingID'];
    let transaction;

    let queryRef = transactionsRef.orderByChild("listingID_renterID_closed").equalTo(listing + '_' + renter + '_false');
    // Get transaction id
    queryRef.once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
            transaction = childSnapshot.key;
        });
    }).then(() => {
        let renterClosed = {renterClosed: true};
        transactionsRef.child(transaction).update(renterClosed, err => {
            if (err) {
                res.send(err)
            } else {
                res.send("Request to end rental period sent to owner.")
            }
        });
    });
}

function ownerClose(params, res) {
    let transactionID = params['transactionID'];
    let ownerClosed = {ownerClosed: true};

    transactionsRef.child(transactionID).update(ownerClosed, err => {
        if (err) {
            res.send(err)
        } else {
            res.send("Rental period ended.")
        }
    });
}

module.exports = {getTransactions, getSingleTransaction, renterInterested, selectRenter, renterConfirm, renterClose, ownerClose};
