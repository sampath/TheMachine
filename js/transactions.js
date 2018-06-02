var database = require('./db.js');
var transactionsRef = database.db.ref("transactions");

function getTransaction(req, ref) {
    let queryRef = null;

    if(req.body.isSingleTransaction) {
        queryRef = transactionsRef.orderByChild("listingID_renterID_closed").equalTo(req.body.listingID + "_" + req.body.renterID + "_" + req.body.closed);
    } else {
        queryRef = transactionsRef.orderByChild("listingID_closed").equalTo(req.body.listingID + "_" + req.body.closed);
    }

    var keyArray = [];

    queryRef.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            keyArray.push(key);
        });
        res.json(keyArray);
    });
}

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

module.exports = {getTransaction, newTransaction, updateTransaction, deleteTransaction};
