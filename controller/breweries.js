var express = require('express');
var router = express.Router(),
    db = require('../models/db.js');

router.get('/', function (req, res ) {
    res.render('breweries');
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

router.get('/breweryTable', function (req, res){
    console.log('brewery table');
    db.getAllBreweries(
        function (err, result) {
            var html = '<table>';
            html = '<tr><th>Brewery</th><th>City</th><th>State</th></tr>';
            for (var i = 0; i < result.length; i++){
                html += '<tr>'
                html += '<td> <a href="/breweries/breweryInfo?breweryID=' + result[i].breweryID + '">' + result[i].breweryName + '</a></td>';
                html += '<td>' + result[i].city + '</td>';
                html += '<td>' + result[i].state + '</td>';
                html += '</tr>';
            }
            html += '</table>';
            res.send(html);
        }
    );
});


router.get('/breweryInfo', function (req, res){
    console.log(req.query.breweryID);
    db.getBreweryById(req.query.breweryID,
        function (err, result){
            console.log(result);
            res.render('breweryInfo', {rs: result});
        }
    );
});

router.post('/breweryRating', function (req, res){
    console.log("getting average rating for breweryID " + req.body.breweryID);
    db.getBreweryAverageRating(req.body.breweryID,
        function (err, result){
            console.log(result[0].average);
            res.send(result[0].average.toString());
        }
    );
})

router.post('/breweryComments', function (req, res){
    console.log('getting brewery comments for breweryId' + req.body.breweryId);
    db.getCommentsOnABrewery(req.body.breweryID,
        function (err, result){
            var responseHTML = '<table>';
            responseHTML += '<tr><th>User</th><th>Comment</th></tr>'
            for (var i = 0; i < result.length; i++){
                responseHTML += '<tr>';
                responseHTML += '<td>' + result[i].userName + '</td>';
                responseHTML += '<td>' + result[i].comment + '</td>';
                responseHTML += '</tr>';
            }
            responseHTML += '</table>'
            res.send(responseHTML);
        }
    );
})

router.post('/beersList', function (req,res){
    console.log('getting beer list for brewery ' + req.body.breweryID);
    db.getAllBeersByaBrewery(req.body.breweryID,
        function (err, result){
            var responseHTML = '<ul id="beersList">'
            for (var i = 0; i < 4 && i < result.length; i++){
                responseHTML += '<li><a href="/beers/getBeerInfo?beerID=' + result[i].beerID
                    + '">' + result[i].beerName + '</a></li>';
            }
        responseHTML += '</ul>';
        res.send(responseHTML);
        }
    );
})


module.exports = router;
