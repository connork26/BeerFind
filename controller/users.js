var express = require('express'),
    router = express.Router(),
    db = require('../models/db.js');

router.get('/', function(req, res) {
    console.log("user requested");
    res.render('users');
});

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

router.post('/userList', function (req, res) {
    console.log("get all users");
    db.getUsers(
        function (err, result) {
            console.log(result);
            var html = '<ul class="userList">';
            html += '<li>Name</li>'
            for (var i = 0; i < result.length; i++) {
                html += '<li><a href="/users/userInfo?userId=' + result[i].userID + '">'
                    + result[i].userName + '</a></li>';
            }
            html += '<ul>';
            res.send(html);
        }
    )
});

router.get('/userInfo', function (req, res){
    res.render('userInfo');
})

module.exports = router;
