//Require database and alert
var database = require('./db.js');
var alertsRef = database.db.ref("alerts");

function getAlerts(req, res){
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

function getAlert(req, res) {
    let userID = req.params.userID;
    let alertID = req.params.alertID;
    alertsRef.child(userID).child(alertID).once("value", function(snapshot) {
        if(snapshot.val() == null) {
            res.send({
                error: 1
            });
        } else {
            res.json(snapshot.val());
        }
    });
}

function postAlert(req, res){
    //Pushes the alert to the database
    alertsRef.push({
      content : req.body.content,
      time : Date.now(),
      read : false,
      transactionID: req.body.transactionID
    });
}

function setAlertToRead(req, res){
    //Changes the alert to have been read
    let id = req.params.id;
    alertsRef.child(id).child('read').set(req.body.read);
}

module.exports = {getAlerts, getAlert, postAlert, setAlertToRead}
