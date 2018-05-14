import db from "../server.js";

var usersRef = db.ref("users");

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
        name: req.body.name,
        registrationDate: Date.now(),
        email: req.body.email,
        phoneNumber: req.body.phoneNumber

    }, function(err) {
        if(err){
            res.send(err)
        }
    });
}

function updateUser(req, res) {
    usersRef.update({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber

    }, function(err) {
        if(err) {
            res.send(err)
        }
    });
    res.json();
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