// Module dependencies

var express    = require('express'),
    mysql      = require('mysql'),
	app = express();

// Application initialization

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : 'ckuehnle',
        password : '3616839'
    });
    
//var app = module.exports = express.createServer();

// Database setup


    connection.query('USE ckuehnle', function (err) {
        if (err) throw err;
});

// Configuration

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

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

app.get('/addBeers', function(req, res) {
    res.sendfile(__dirname + '/addBeers.html');
});

app.get('/beers/findbeer', function (req, res) {
    res.sendfile(__dirname + '/find_beer.html');
});
	

// create user
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

// create beer
app.post('/addBeers', function (req, res) {
	console.log(req.body);
	connection.query('INSERT INTO Beer SET ?', req.body,
		function (err, result) {
			if (err) throw err;
			connection.query('SELECT beerName, beerID FROM Beer where beerName = ? ', req.body.beerName,
			function (err, result) {
				if (result.length > 0) {
					res.send(result[0].beerName + ' added with beerID ' + result[0].beerID);
				}
				else {
					res.send('Error: Check entry params');
				}
			});
			
		}
	);		
});

// get all breweries to put in a <select>
app.post('/beers/select', function (req, res) {
    console.log(req.body);
	connection.query('select * from Brewery', 
		function (err, result) {
			console.log(result);
			var responseHTML = '<select id="breweries_list">';
			for (var i=0; result.length > i; i++) {
				var option = '<option value="' + result[i].breweryID + '">' + result[i].breweryName + '</option>';
				console.log(option);
				responseHTML += option;
			}
            responseHTML += '</select>';
			res.send(responseHTML);			
		});
});

//get all beers brewed by a brewery. returned in a table 
app.post('/beers', function (req, res) {
	console.log(req.body);
	connection.query('select * from Beer where breweryID = ?', req.body.id, 
		function (err, result) {
			console.log(result);
			if (result.length > 0) {
				var responseHTML = '<table><tr><th>Beer Name</th><th>Style</th><tr>'
				for(var i = 0; i < result.length; i++){
					responseHTML += '<tr>'
					responseHTML += '<td><a href="/beers/findbeer/?beerID=' + result[i].beerID + '">'
						+ result[i].beerName + '<td>';
					responseHTML += '<td>' + result[i].style + '<td>';		
					responseHTML += '</tr>';			
				}
				responseHTML += '</table>';
				res.send(responseHTML);
			}
			else {
				res.send('No beers in database');	
			}
		}
	);
});

app.post('/beers/getBeerInfo', function (req, res){
	console.log(req.query.beerID);
	connection.query('select * from Beer b natural join Brewery br where beerID = ?', req.query.beerID,
		function (err, result) {
			console.log(result);
			if (result.length > 0) {
				var responseHTML = '<p>Beer Name: ' + result[0].beerName + '</p>';
				responseHTML = '<p>Brewery Name: ' + result[0].breweryName + '</p>';
				responseHTML = '<p>Style: ' + result[0].style + '</p>';
				responseHTML = '<p>ABV: ' + result[0].style + '</p>';
				responseHTML = '<p>Description: ' + result[0].description + '</p>';
			}
		res.send(response.HTML);
	});
});
				

// Begin listening

app.listen(8124, "127.0.0.1");
console.log("Express server listening on port %d in %s mode",  app.settings.env);
