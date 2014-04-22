var express = require('express');
var router = express.Router(),
    db = require('../models/db.js');


router.get('/', function(req, res) {
    console.log("beers requested");
    res.render('beers');
    //res.sendfile(__dirname + '/beers.html');
});

router.get('/addBeers', function(req, res) {
    res.render('addBeers');
    // res.sendfile(__dirname + '/addBeers.html');
});

// create beer
router.post('/addBeers', function (req, res) {
    console.log(req.body);
    db.insertBeer(req.body,
        function (err, result) {
            if (result.length > 0) {
                res.send(result[0].beerName + ' added with beerID ' + result[0].beerID);
            }
            else {
                res.send('Error: Check entry params');
            }
        }
    );
});

// get all breweries to put in a <select>
router.post('/selectbrewery', function (req, res) {
    db.getAllBreweries(
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
router.post('/selectstyle', function (req, res) {
    db.getAllStyles(
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
router.post('/beersfrombrewery', function (req, res) {
    console.log('beers by brewery');
    console.log(req.body.breweryID);
    db.getAllBeersByaBrewery(req.body.breweryID,
        function (err, result) {
            if (result.length > 0) {
                var responseHTML = '<table><tr><th>Beer Name</th><th>Style</th><tr>'
                for(var i = 0; i < result.length; i++){
                    responseHTML += '<tr>'
                    responseHTML += '<td><a href="/beers/getBeerInfo?beerID=' + result[i].beerID + '">'
                        + result[i].beerName + '</td>';
                    responseHTML += '<td>' + result[i].style + '</td>';
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
router.post('/beersfromstyle', function (req, res){
    console.log('beers by style')
    console.log(req.body.style);
    db.getAllBeersOfAStyle(req.body.style,
        function(err, result) {
            if (result.length > 0) {
                var responseHTML = '<table><tr><th>Beer Name</th><th>Style</th><tr>'
                for(var i = 0; i < result.length; i++){
                    responseHTML += '<tr>'
                    responseHTML += '<td><a href="/beers/getBeerInfo?beerID=' + result[i].beerID + '">'
                        + result[i].beerName + '</td>';
                    responseHTML += '<td>' + result[i].style + '</td>';
                    responseHTML += '</tr>';
                }
                responseHTML += '</table>';
                res.send(responseHTML);
            }
            else {
                res.send('No beers of that style');
            }
        }
    );
});

router.get('/getBeerInfo', function (req, res){
    console.log(req.query.beerID);
    db.getBeerInfo(req.query.beerID,
        function (err, result) {
            console.log(result);
            res.render('beerInfo', {rs: result});
        }
    );
});

router.post('/beerRating', function (req, res){
    console.log("getting average rating for beerID " + req.body.beerID);
    db.getBeerAverageRating(req.body.beerID,
        function (err, result){
            console.log(result[0].average);
            res.send(result[0].average.toString());
        }
    );
})

module.exports = router;
