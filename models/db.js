var mysql = require('mysql');

// Application initialization

var connection = mysql.createConnection({
    host     : 'cwolf.cs.sonoma.edu',
    user     : 'ckuehnle',
    password : '3616839'
});

// Database setup

connection.query('USE ckuehnle', function (err) {
    if (err) throw err;
});

exports.getBreweryById = function (breweryID, callback) {
    connection.query('select * from Brewery where breweryID = ?', breweryID,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.getAllBreweries = function (callback) {
    connection.query('select * from Brewery',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.getAllStyles = function (callback) {
    connection.query('select style from Beer group by style order by style',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.insertBeer = function (body, callback) {
    connection.query('INSERT INTO Beer SET ?', body,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            connection.query('SELECT beerName, beerID FROM Beer where beerName = ? ', body.beerName,
                function (err, result) {
                    if (err) {
                        console.log(err);
                        callback(true);
                        return;
                    }
                    callback(false, result);
                }
            );
        }
    );
}

exports.getAllBeersByaBrewery = function (breweryID, callback) {
    connection.query('select * from Beer where breweryID = ?', breweryID,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.getAllBeersOfAStyle = function (style, callback) {
    connection.query('select * from Beer b natural join Brewery br where style = ?', style,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.getBeerInfo = function (beerID, callback) {
    connection.query('select * from Beer b natural join Brewery br where beerID = ?', beerID,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.createUser = function (body, callback) {
    connection.query('INSERT INTO User SET ?', body,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            connection.query('select userName, userID from User where userName = ?', body.userName,
                function (err, result) {
                    if (err) {
                        console.log(err);
                        callback(true);
                        return;
                    }
                    callback(false, result);
                }
            );
        }
    );
}
