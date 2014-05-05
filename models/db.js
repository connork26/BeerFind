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

exports.getBreweryAverageRating = function (breweryID, callback) {
    connection.query('select avg(rating) as average from BreweryRatings where breweryID = ?', breweryID,
    function (err, result){
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        callback(false, result);
    });
}

exports.getBeerAverageRating = function (beerID, callback) {
    connection.query('select avg(rating) as average from BeerRatings where beerID = ?', beerID,
    function (err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        callback(false, result);
    });
}

exports.getUsers = function (callback){
    connection.query('select * from User',
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    )
}

exports.getUserInfo = function (userID, callback) {
    connection.query('select * from User where userID = ?', userID,
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

exports.changeUserPassword = function (userID, newPassword, callback) {
    var query = "update User set password = '" + newPassword + "' where userID = " + userID;
    connection.query(query,
        function (err, result){
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.getCommentsOnABeer = function (beerID, callback) {
    connection.query("select * from commentsOnABeer where beerID = ?", beerID,
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

exports.getCommentsOnABrewery = function (breweryID, callback) {
    connection.query("select * from commentsOnABrewery where breweryID = ?", breweryID,
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

exports.deleteUser = function (userID, callback) {
    connection.query("delete from BeerComments where userID = ?", userID,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
        }
    );
    connection.query("delete from BeerRatings where userID = ?", userID,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
        }
    );
    connection.query("delete from BreweryComments where userID = ?", userID,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
        }
    );
    connection.query("delete from BreweryRatings where userID = ?", userID,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
        }
    );
    connection.query("delete from User where userID = ?", userID,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
        }
    );
}

exports.submitCommentAndRating = function (info, callback) {
    var commentQuery = "insert into BeerComments (beerID, userID, comment) values ("
        + info.beerID + ', ' + info.userID + ', "' +  info.comment + '")';

    var ratingQuery = "insert into BeerRatings (beerID, userID, rating) values ("
        + info.beerID + ", " + info.userID + ', ' + info.rating + ')';

    connection.query(commentQuery,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
        }
    );

    connection.query(ratingQuery,
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
        }
    );
}