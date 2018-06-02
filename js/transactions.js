var database = require('./db.js');
var transactionsRef = database.db.ref("transactions");

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
// ?listingID=&renterID=&closed=
function getTransaction(req, res) {
    let queryRef = null;
    queryRef = transactionsRef.orderByChild("listingID_closed").equalTo(req.query.listingID + "_" + req.query.closed);
    //queryRef = transactionsRef.orderByChild("listingID_renterID_closed").equalTo(req.query.listingID + "_" + req.query.renterID + "_" + req.body.closed);
    var keyArray = [];

    queryRef.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            //.child to get renterid
            var key = childSnapshot.key;
            keyArray.push(key);
        });
        res.json(keyArray);
    });
}

// ?listingID=&ownerID=&renterID=&price=
function newTransaction(req, res) {

    transactionsRef.push({
        listingID: req.query.listingID,
        ownerID: req.query.ownerID, //user id of the owner,
        renterID: req.query.renterID, //current user,
        price: req.query.price,
        startTime: Date.now(),
        endTime: Date.now(),
        ownerConfirmed: false,
        renterConfirmed: true,
        ownerClosed: false,
        renterClosed: false,
        closed: false,
        listingID_closed: req.query.listingID + "_" + false,
        listingID_renterID_closed: req.query.listingID + "_" + req.query.renterID + "_" + false

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

module.exports = {getTransaction, newTransaction, updateTransaction, deleteTransaction, getSingleTransaction};
