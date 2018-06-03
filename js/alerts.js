//Require database and alert
var database = require('./db.js');
var alertsRef = database.db.ref("alerts");

function getAlert(req, res){
    //Gets the alerts specific to the the userID
    let id = req.params.id;
    alertsRef.child(id).once("value", snapshot => {
        if(snapshot.val() == null) {
            res.send("User id error");
        } else {
            res.json(snapshot.val())
        }
    });
}

function postAlert(req, res){
    //Pushes the alert to the database
    alertsRef.push({
      content : req.params.content,
      time : Date.now(),
      read : false
    });
}

function setAlertToRead(req, res){
    //Changes the alert to have been read
    let id = req.params.id;
    alertsRef.child(id).child('read').set(req.params.read);
}

module.exports = {getAlert, postAlert, setAlertToRead}
