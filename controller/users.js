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

router.post('/userSelect', function (req, res) {
    db.getUsers(
        function (err, result){
            var html = '<select id="user">';
            for (var i = 0; i < result.length; i++){
                html += '<option value="' + result[i].userID + '">'
                    + result[i].userName + '</option>';
            }
            html += '</select>';
            res.send(html);
        }
    )
})

router.get('/userInfo', function (req, res){
    db.getUserInfo(req.query.userId,
        function(err, result) {
            console.log(result);
            res.render('userInfo', {rs: result});
        }
    );
})

router.post('/changePassword', function (req, res){
    db.changeUserPassword(req.body.userID, req.body.newPassword,
        function() {
            res.send('<p style="color: green">Password Changed Successfuly!</p>')
        }
    );
})

router.get('/deleteUser', function (req, res){
    console.log("deleting user " + req.query.userID);
    db.deleteUser(req.query.userID,
        function(err, result){
    });
    res.render('users');
})

module.exports = router;
