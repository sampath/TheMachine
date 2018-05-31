//Require server and alert
var server = require('../server');
var alertsRef = server.db.ref("alerts");

function getAlert(req, res){
    //Gets the alerts specific to the the userID
    let id = req.param.id;
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
      content : req.body.content,
      time : Date.now(),
      read : false
    });
}

function readAlert(req, res){
    //Changes the alert to have been read
    let id = req.param.id;
    alertsRef.child(id).child(read).setValue(true);
}

module.exports = {getAlert, postAlert, readAlert}
