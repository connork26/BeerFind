// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');

// Application initialization

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : 'ckuehnle',
        password : '3616839'
    });
    
var app = module.exports = express.createServer();

// Database setup


    connection.query('USE ckuehnle', function (err) {
        if (err) throw err;
});

// Configuration

app.use(express.bodyParser());

// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/index', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/user', function(req, res) {
    res.sendfile(__dirname + '/user.html');
});

app.get('/beers', function(req, res) {
    res.sendfile(__dirname + '/beers.html');
});

// Update MySQL database

app.post('/user', function (req, res) {
	console.log(req.body);
    connection.query('INSERT INTO User SET ?', req.body, 
        function (err, result) {
            if (err) throw err; 
			connection.query('select userName, userID from User where userName = ?', req.body.userName,
			function (err, result) {
				console.log('result length: ' + result.length);
				if (result.length > 0) {
            		res.send('User ' + result[0].userName + ' added to database with ID: ' + result[0].userID);
				}
				else {
					res.send('Error: Check entry params');
				}
			});
		}
    );
});

// Begin listening

app.listen(8124, "127.0.0.1");
console.log("Express server listening on port %d in %s mode",  app.settings.env);
