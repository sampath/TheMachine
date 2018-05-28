var server = require('../server');
var transactionsRef = server.db.ref("transactions");

function getTransaction(req, res) {
    let id = req.params.id;
    transactionRef.child(id).once("value", function(snapshot) {
        if(snapshot.val() == null) {
            res.send("Transaction id error");
        } else {
            res.json(snapshot.val())
        }
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
		closed: false
    
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
