var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    console.log("index requested");
    res.render('index');
});

router.get('/index', function(req, res) {
    console.log("index requested");
    res.render('index');
});

router.get('/about', function (req, res){
    console.log("About requested");
    res.render('about');
})

module.exports = router;
