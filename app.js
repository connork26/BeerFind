// Module dependencies

var express     = require('express'),
    mysql       = require('mysql'),
	app		    = express(),
	ejs         = require('ejs'),
    bodyparser  = require('body-parser'),
    connect     = require('connect');

var routes      = require('./controller/index'),
    beers       = require('./controller/beers'),
    breweries   = require('./controller/breweries'),
    users       = require('./controller/users');

// Configuration

app.use(connect.urlencoded());
app.use(connect.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views'); 

// Begin listening

app.use('/', routes);
app.use('/beers', beers);
app.use('/breweries', breweries);
app.use('/users', users);

app.listen(8124, "127.0.0.1");
console.log("Express server listening");
