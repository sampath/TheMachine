/* Admin SDK Setup */
var admin = require('firebase-admin');
var firebase = require('firebase');
var serviceAccount = require('../credentials.json');

//Firebase config
var config = {
	apiKey: "AIzaSyAa7xJzMvvYSZbBbfaTb3-k4eSBqzAYYsI",
	authDomain: "flick-b0e2c.firebaseapp.com",
	databaseURL: "https://flick-b0e2c.firebaseio.com",
	storageBucket: "flick-b0e2c.appspot.com",
};
firebase.initializeApp(config);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://flick-b0e2c.firebaseio.com"
});
console.log("Admin SDK setup complete");

/* Get Route Handlers */
var db = admin.database();

/* Set up Admin Storage Bucket */
const bucket = admin.storage().bucket("flick-b0e2c.appspot.com");
console.log("done");

module.exports= {
	db: db,
	bucket: bucket
};
