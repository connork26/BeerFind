// Module dependencies

var express    = require('express'),
    mysql      = require('mysql'),
	app		= express(),
	ejs = require('ejs');
	

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
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views'); 


// Main route sends our HTML file

app.get('/', function(req, res) {
    console.log("index requested");
    res.render('index');
    //res.sendfile(__dirname + '/index.html');
});

app.get('/index', function(req, res) {
    console.log("index requested");
    res.render('index');
    //res.sendfile(__dirname + '/index.html');
});

app.get('/user', function(req, res) {
    console.log("user requested");
    res.render('user');
    //res.sendfile(__dirname + '/user.html');
});

app.get('/beers', function(req, res) {
    console.log("beers requested");
    res.render('beers');
    //res.sendfile(__dirname + '/beers.html');
});

app.get('/addBeers', function(req, res) {
    res.render('addBeers');
    // res.sendfile(__dirname + '/addBeers.html');
});

app.get('/breweries', function (req, res ) {
	res.render('breweries');
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
app.post('/beers/selectbrewery', function (req, res) {
	connection.query('select * from Brewery',
		function (err, result) {
			var responseHTML = '<select id="breweries_list">';
			for (var i=0; result.length > i; i++) {
				var option = '<option value="' + result[i].breweryID + '">' + result[i].breweryName + '</option>';
				responseHTML += option;
			}
            responseHTML += '</select>';
			res.send(responseHTML);			
		}
	);
});

// get all styles to put in a <select>
app.post('/beers/selectstyle', function (req, res) {
	connection.query('select style from Beer group by style order by style',
		function (err, result) {
			var responseHTML = '<select id="styles_list">';
			for (var i=0; result.length > i; i++) {
				var option = '<option value="' + result[i].style + '">' + result[i].style + '</option>';
				responseHTML += option;
			}
            responseHTML += '</select>';
			res.send(responseHTML);			
		}
	);
});

//get all beers brewed by a brewery. returned in a table 
app.post('/beersfrombrewery', function (req, res) {
	console.log('beers by brewery');
	connection.query('select * from Beer where breweryID = ?', req.body.id, 
		function (err, result) {
			if (result.length > 0) {
				var responseHTML = '<table><tr><th>Beer Name</th><th>Style</th><tr>'
				for(var i = 0; i < result.length; i++){
					responseHTML += '<tr>'
					responseHTML += '<td><a href="/getBeerInfo/?beerID=' + result[i].beerID + '">'
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

// get all beer of a certain style
app.post('/beersfromstyle', function (req, res){
    console.log('beers by style')
	connection.query('select * from Beer where style = ?', req.body.style,
		function(err, result) {
			if (result.length > 0) {
				var responseHTML = '<table><tr><th>Beer Name</th><th>Style</th><tr>'
				for(var i = 0; i < result.length; i++){
					responseHTML += '<tr>'
					responseHTML += '<td><a href="/getBeerInfo/?beerID=' + result[i].beerID + '">'
						+ result[i].beerName + '<td>';
					responseHTML += '<td>' + result[i].style + '<td>';		
					responseHTML += '</tr>';			
				}
				responseHTML += '</table>';
				res.send(responseHTML);
			}
			else {
				res.send('No beers of that style');
			}
		});
});

app.get('/getBeerInfo/', function (req, res){
	console.log(req.query.beerID);
	connection.query('select * from Beer b natural join Brewery br where beerID = ?', req.query.beerID,
		function (err, result) {
			console.log(result);
		    res.render('beerInfo', {rs: result});
	});
});
				

// Begin listening

app.listen(8124, "127.0.0.1");
console.log("Express server listening on port %d in %s mode",  app.settings.env);
