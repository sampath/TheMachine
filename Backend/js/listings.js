import db from "../server.js"

var listingsRef = db.ref("listings");

function getListings(req, res) {
    res.json();
}

function getListing(req, res) {
    res.json();
}

function newListing(req, res) {
    res.json();
}

function updateListing(req, res) {
    res.json();
}

function deleteListing(req, res) {
    res.json();
}

export {getListings, getListing, newListing, updateListing, deleteListing}