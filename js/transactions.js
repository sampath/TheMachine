var database = require('./db.js');
var transactionsRef = database.db.ref("transactions");

// ?renterID=&listingID
function selectRenter(req, res){
    // Deletes all renters interested in the item EXCEPT for given renter
    let renter = req.body.renterID;
    let listing = req.body.listingID;

    queryRef = transactionsRef.orderByChild("listingID_closed").equalTo(listing + "_false");

    queryRef.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childRenterID = childSnapshot.child("renterID").val();
            if(childRenterID!=renter){
                transactionsRef.child(childSnapshot.key).remove(function(err){
                    if(err){
                        res.send(err);
                    }else{
                        res.json();
                    }
                });
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

//TODO pass in listing + userID, check if there is a transaction under that name
// Query strings:
// ?check=&listingID=&closed=
function getTransactions(req, res) {
    let queryRef = null;

    if(req.query.check == 'true') {
        queryRef = transactionsRef.orderByChild("listingID_renterID_closed").equalTo(req.query.listingID + "_" + req.query.renterID + "_" + req.query.closed);
        queryRef.once("value", function(snapshot) {
            console.log(snapshot.val());
            console.log(snapshot.exists());
            if(snapshot.exists()) {
                res.json(false);
            } else {
                res.json(true);
            }
        });
        // if(queryRef == null) {
        //     res.json(false);
        // } else {
        //     res.json(true);
        // }
    } else {
        queryRef = transactionsRef.orderByChild("listingID_closed").equalTo(req.query.listingID + "_" + req.query.closed);

        var keyArray = [];

        queryRef.once("value").then(function(snapshot) {
            keyArray = snapshot.val()
            // snapshot.forEach(function(childSnapshot) {
            //     //.child to get renterid
            //     var key = childSnapshot.key;
            //     keyArray.push(key);
            // });
            res.json(keyArray);
        });
    }
}

// ?listingID=&ownerID=&renterID=&price=
function newTransaction(req, res) {

    transactionsRef.push({
        listingID: req.body.listingID,
        ownerID: req.body.ownerID, //user id of the owner,
        renterID: req.body.renterID, //current user,
        price: req.body.price,
        startTime: Date.now(),
        endTime: Date.now(),
        ownerConfirmed: false,
        renterConfirmed: true,
        ownerClosed: false,
        renterClosed: false,
        closed: false,
        listingID_closed: req.body.listingID + "_" + false,
        listingID_renterID_closed: req.body.listingID + "_" + req.body.renterID + "_" + false

    }, function(err) {
        if(err){
            res.send(err)
        }
    });
}

function updateTransaction(req, res) {
    let id = req.params.id;
    let transaction = {};
    req.body.keys.forEach((param) => {
        transaction[param] = req.body[param];
    });
    transactionsRef.child(id).update(transaction, function(err) {
        if(err) {
            res.send(err)
        }
    });
    res.json();
}

function deleteTransaction(req, res) {
    let id = req.params.id;
    transactionsRef.child(id).remove(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.json();
        }
    });
}

module.exports = {getTransactions, newTransaction, updateTransaction, deleteTransaction, getSingleTransaction, selectRenter};
