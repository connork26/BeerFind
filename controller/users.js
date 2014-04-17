var express = require('express'),
    router = express.Router(),
    db = require('../models/db.js');

router.get('/', function(req, res) {
    console.log("user requested");
    res.render('user');
});

// create user
router.post('/createUser', function (req, res) {
    console.log(req.body);
    db.createUser(req.body,
        function(err, result) {
            if (result.length > 0) {
                res.send('User ' + result[0].userName + ' added to database with ID: ' + result[0].userID);
            }
            else {
                res.send('Error: Check entry params');
            }
        }
    );

});

module.exports = router;
