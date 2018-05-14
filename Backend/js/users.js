import db from "../server.js";

var usersRef = db.ref("users");

function getUsers(req, res) {
    usersRef.once("value", (snapshot, prevChildKey) => {
        res.json(snapshot.val())
    });
    res.json();
}

function getUser(req, res) {
    res.json();
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
    res.json();
}

function updateUser(req, res) {
    res.json();
}

function deleteUser(req, res) {
    res.json();
}

export {getUsers, getUser, newUser, updateUser, deleteUser}