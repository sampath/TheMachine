//import db from "../database.js";
var database = require('./db.js');
var usersRef = database.db.ref("users");

function getUsers(req, res) {
    usersRef.once("value", (snapshot, prevChildKey) => {
        res.json(snapshot.val())
    });
}

function getUser(req, res) {
    let id = req.params.id;
    usersRef.child(id).once("value", function(snapshot) {
        if(snapshot.val() == null) {
            res.send("User id error");
        } else {
            res.json(snapshot.val())
        }
    });
}

function newUser(req, res) {
    usersRef.push({
        name: req.body.name,//req.body.name,
        registrationDate: Date.now(),
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        renterAvgRating: 0.0,
        ownerAvgRating: 0.0,
        numRenterRatings: 0,
        numOwnerRatings: 0

    }, function(err) {
        if(err){
            res.send(err)
        }
    });
}

function updateUser(req, res) {
    let id = req.params.id;
    usersRef.child(id).once("value", snapshot => {
        var user = snapshot.val();
        for (property in req.body) {
            if (req.body[property] != '') {
                user[property] = req.body[property];
            }
        }
        usersRef.child(id).update(user, err => {
            if(err) {
                res.send(err);
            } else {
                res.send("Successfully Updated")
            }
        });
    });
}

function deleteUser(req, res) {
    let id = req.params.id;
    usersRef.child(id).remove(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.json();
        }
    });
}

module.exports = {getUsers, getUser, newUser, updateUser, deleteUser};
