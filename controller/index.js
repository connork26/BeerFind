var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    console.log("index requested");
    res.render('index');
    //res.sendfile(__dirname + '/index.html');
});

router.get('/index', function(req, res) {
    console.log("index requested");
    res.render('index');
    //res.sendfile(__dirname + '/index.html');
});

module.exports = router;
