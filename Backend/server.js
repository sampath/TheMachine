/* Imports */
var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var database = require('./js/db.js');
var routes = require('./js/routes.js');

//Init Express Application
var app = express();
var router = express.Router();

// Set up Routes
console.log("Create Routes");
router.use(bodyParser.urlencoded({extended:true}));
router.use(methodOverride('_method'));
routes.createRoutes(router);

//Init Application
app.use('/', router);
app.listen(process.env.PORT || 3000, () => {
    console.log('server started at http://localhost:3000/');
});