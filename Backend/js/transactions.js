var server = require('../server');
var transactionsRef = server.db.ref("transactions");

function newTransaction(owner, renter, listing, listingPrice) {
    
    transactionsRef.push({
        listingID: listing,
        ownerID: owner, //user id of the owner,
        renterID: renter, //current user,
        price: listingPrice,
        startTime: Date.now(),
        endTime: Date.now(),
        ownerConfirmed: false,
		renterConfirmed: true,
		ownerClosed: false,
		renterClosed: false,
		closed: false

    });

}

