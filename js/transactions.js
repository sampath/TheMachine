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

//should call getTransactions first in order to check if actually exists or not
// Query strings:
// ?listingID=&renterID=&closed=
function getTransactionID(req, res) {
    let queryRef = null;
    queryRef = transactionsRef.orderByChild("listingID_renterID_closed").equalTo(req.query.listingID + "_" + req.query.renterID + "_" + req.query.closed);
    queryRef.once("value", function(snapshot) {
        res.json(snapshot.getKey());
    })
}

//TODO pass in listing + userID, check if there is a transaction under that name
// Query strings:
// ?check=&listingID=&renterID=&closed=
function getTransactions(req, res) {

    let queryRef = null;
    // try transactionsref for each loop and then go through, check each child, and then try and add that to array, if the array size is empty, then return true, if it isn't then return false
    if(req.query.check == 'true') {
        queryRef = transactionsRef.orderByChild("listingID_renterID_closed").equalTo(req.query.listingID + "_" + req.query.renterID + "_" + req.query.closed);
        var transactionsArray = [];
        queryRef.once("value", function(snapshot) {
            snapshot.forEach(function(item) {
                transactionsArray.push(item);
            });
            if(transactionsArray.length <= 0) {
                res.json(false);
            } else {
                res.json(true);
            }
        });

        // queryRef.once("value", function(snapshot) {
        //     console.log(snapshot.val());
        //     console.log(snapshot.exists());
            // if(snapshot.exists()) {
            //     res.json(false);
            // } else {
            //     res.json(true);
            // }
        // });
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

/*
 *  req {
 *      body {
 *          listingID: <listing's id>,
 *          ownerID: <owner's user id>,
 *          renterID: <renter's user id>,
 *          price: <price>
 *      }
 *  }
 */
function renterInterested(req, res) {

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

/*
 *  req {
 *      body {
 *          listingID: <listing's id>,
 *          renterID: <renter's id>
 *      }
 *  }
 */
function selectRenter(req, res){
    // Deletes all renters interested in the item EXCEPT for given renter
    let renter = req.body.renterID;
    let listing = req.body.listingID;

    let queryRef = transactionsRef.orderByChild("listingID_closed").equalTo(listing + "_false");

    queryRef.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childRenterID = childSnapshot.child("renterID").val();
            if(childRenterID!=renter){
                _deleteTransaction(childSnapshot.key, res);
            } else {
                childSnapshot.update({ownerConfirmed: true, renterConfirmed: false}, err => {
                    if (err) {
                        res.send(err);
                    }
                });
            }
        });
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

/*
 *  req {
 *      body {
 *          transactionID: <id of corresponding transaction>
 *      }
 *  }
 */
function renterConfirm(req, res) {
    let transactionID = req.body.transactionID;
    transactionsRef.child(transactionID).update({renterConfirmed: true}, err => {
        if (err) {
            res.send(err)
        } else {
            res.send('Renting period started.')
        }
    });
}

/*
 *  req {
 *      body {
 *          renterID: <renter's user id>,
 *          listingID: <listing's id>
 *      }
 *  }
 */
function renterClose(req, res) {
    let renterID = req.body.renterID;
    let listingID = req.body.listingID;
    let transaction;

    let queryRef = transactionsRef.orderByChild("listingID_renterID_closed").equalTo(listingID + '_' + renterID + '_false');
    // Get transaction id
    queryRef.once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
            transaction = childSnapshot.key;
        });
    }).then(() => {
        transactionsRef.child(transaction).update({renterClosed: true}, err => {
            if (err) {
                res.send(err)
            } else {
                res.send("Request to end rental period sent to owner.")
            }
        });
    });
}

function getUserTransactions(req, res){
    let id = req.params.id;
    let ownerQuery = transactionsRef.orderByChild("ownerID").equalTo(id);
    let renterQuery = transactionsRef.orderByChild("renterID").equalTo(id);

    var transactionsArray = "";

    ownerQuery.once("value").then(function(snapshot) {
      //  transactionsArray = new Array(snapshot.val())
        let ownerArray = [];
        snapshot.forEach(function(item) {
            ownerArray.push(item);
        });
        renterQuery.once("value").then(function(snapshot2) {
            snapshot2.forEach(function(item2){
                ownerArray.push(item2);
            });

            res.json(ownerArray);
            // let renterArray = [];
            // renterArray = snapshot2.val();
            // for(var i = 0; i < ownerArray.length; i++) {
            //     renterArray += ownerArray[i];
            // }
            // //console.log(ownerArray[0]);
            // res.json(renterArray);
        });
    });
}

/*
 *  req {
 *      body {
 *          transactionID: <id of corresponding transaction>
 *      }
 *  }
 */
function ownerClose(req, res) {
    let transactionID = req.body.transactionID;
    let closed;

    let transaction = transactionsRef.child(transactionID);
    transaction.once("value", snapshot => {
        let child = snapshot.val();
        closed = {
            ownerClosed: true,
            closed: true,
            listingID_closed: child.listingID + '_' + true,
            listingID_renterID_closed: child.listingID + '_' + child.renterID + '_' + true
        };
    }).then(() => {
        transaction.update(closed, err => {
            if (err) {
                res.send(err)
            } else {
                res.send("Rental period ended.")
            }
        });
    });
}

module.exports = {getUserTransactions, getTransactions, getSingleTransaction, renterInterested, selectRenter, renterConfirm, renterClose, ownerClose};
