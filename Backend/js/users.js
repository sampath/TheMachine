//import db from "../server.js";
var server = require('../server');
var usersRef = server.db.ref("users");

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


    var token;
    var user;

    // Set up Google provider object
    var provider = server.admin.auth.GoogleAuthProvider();
    server.admin.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
        token = result.credential.accessToken;
        token = ya29.GlvGBTfnE5Q0gjByKpaDSlkcajnK4yv_x_FeKIMN4y18Fii6uUtaShOB0SAd_KVMavaqlkSlVaXFy_Lefd7zv7hUM_5YE6HHn35KPX_g512696zeH_KvqQUfM7jX;
    	// The signed-in user info.
  	user = result.user;
  	// ...
    }).catch(function(error) {
  	// Handle Errors here.
  	var errorCode = error.code;
  	var errorMessage = error.message;
  	// The email of the user's account used.
  	var email = error.email;
  	// The firebase.auth.AuthCredential type that was used.
  	var credential = error.credential;
  	// ...
    });

    usersRef.push({
        name: user,//req.body.name,
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
    let id = req.params.id;
    let user = {};
    req.body.keys.forEach((param) => {
        user[param] = req.body[param];
    });
    usersRef.child(id).update(user, function(err) {
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
