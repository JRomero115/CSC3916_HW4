/*
CSC3916 HW3
File: Server.js
Description: Web API scaffolding for Movie API
 */

require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
db = require('./db')(); //hack
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

// Sign-up
router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, msg: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

// Return errors for other methods
router.get('/signup', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});

router.put('/signup', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});

router.delete('/signup', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});

router.patch('/signup', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});

// Sign-in
router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

// Return errors for other methods
router.get('/signin', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});

router.put('/signin', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});

router.delete('/signin', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});

router.patch('/signin', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});

// Movies
router.get('/movies', function(req, res) {
    Movie.find(function(err, movie) {
        if (err) {
            res.json({msg: 'Movies not found.'})
        }
        res.json(movie);
    });
});

router.post('/movies', function(req, res) {
    if (!req.body.title || !req.body.year || !req.body.actors) {
        res.json({success: false, msg: 'Please include a title, year, and at least (1) actor/character name.'})
    } else {
        var movie = new Movie();
        movie.title = req.body.title;
        movie.year = req.body.year;
        movie.genre = req.body.genre;
        movie.actors = req.body.actors

        Movie.findOne({ title: movie.title, year: movie.year }).select('title year').exec(function(err, movie) {
            if (err) {
                res.send(err);
            }

            movie.compareTitle(movie.title, function(isMatch) {
                if (isMatch) {
                    res.json({success: false, msg: 'Movie already exists.'})
                }
                else {
                    movie.save(function(err) {
                        if (err) {
                            res.json(err);
                        }
                        res.json({success: true, msg: 'Successfully created a new movie.'})
                    });
                }
            })
        })
    }
});

/*
router.post('/movies', function(req, res) {
    if (!req.body.title || !req.body.year || !req.body.actors) {
        res.json({success: false, msg: 'Please include a title, year, and at least (1) actor/character name.'})
    } else {
        var movie = new Movie();
        movie.title = req.body.title;
        movie.year = req.body.year;
        movie.genre = req.body.genre;
        movie.actors = req.body.actors;

        Movie.find({ title: req.body.title, year: req.body.year }, function(err, movie){
            if (err.code == 11000) {
                res.json({ success: false, msg: 'That movie already exists.'});
            }

            res.json({success: true, msg: 'Successfully created a new movie.'})
        });
    }
});
*/

/*
router.put('/movies', function(req, res) {
    if (!req.body.title) {
        res.json({success: false, msg: 'Please update the movie title.'})
    } else {
        var updateMovie = new Movie();
        updateMovie.title = req.body.title;

    filte
        /*
    Movie.findOne({ title: req.body.title }, function(err, newMovie){
        if (err) {
            res.json(err);
        } else {
            Movie.updateOne("title": {}, {$set: movie}, function(err, newMovie))
        }

        res.json({success: true, msg: 'Successfully created a new movie.'})
    });

});
*/



/*
router.route('/movies')
    .post(function (req, res) {
        if (!req.body.title || !req.body.year || !req.body.actor1 || !req.body.char1) {
            res.json({success: false, msg: 'Please include the title, year, (1) actor and their character name.'})
        } else {
            var movie = new Movie();
            movie.title = req.body.title;
            movie.year = req.body.year;
            movie.genre = req.body.genre;
            movie.actor1 = req.body.actor1;
            movie.char1 = req.body.char1;

            movie.save(function(err){
                if (err) {
                    if (err.code == 11000)
                        return res.json({ success: false, msg: 'That movie already exists.'});
                    else
                        return res.json(err);
                }

                console.log(req.body);
                res = res.status(200);
                if(req.get('Content-Type')){
                    console.log("Content-Type: " + req.get('Content-Type'));
                    res = res.type(req.get('Content-Type'));
                }

                res.status(200).send({
                    status: 200,
                    msg: 'Movie saved.',
                    title: req.title,
                    year: req.year,
                    genre: req.body.genre,
                    actor1: req.body.actor1,
                    character1: req.body.char1});
            });
        }
});

 */

/*
router.route('/movies')
    .get(function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if(req.get('Content-Type')){
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            var o = getJSONObjectForMovieRequirement(req);
            res.status(200).send({
                status: 200, msg: 'GET movies',
                headers: o.headers,
                query: req.query,
                env: o.key});
        }
    )
    .post(function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            var o = getJSONObjectForMovieRequirement(req);
            res.status(200).send({
                status: 200, msg: 'movie saved',
                headers: o.headers,
                query: req.query,
                env: o.key});
        }
    )
    .put(authController.isAuthenticated, function(req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                res = res.type(req.get('Content-Type'));
            }
            var o = getJSONObjectForMovieRequirement(req);
            res.status(200).send({
                status: 200, msg: 'movie updated',
                headers: o.headers,
                query: req.query,
                env: o.key});
        }
    );

router.delete('/movies', function (req, res) {
    console.log(req.body);
    res = res.status(200);
    if (req.get('Content-Type')) {
        res = res.type(req.get('Content-Type'));
    }
    var o = getJSONObjectForMovieRequirement(req);
    res.status(200).send({
        status: 200,
        msg: 'movie deleted',
        headers: o.headers,
        query: req.query,
        env: o.key});
});


 */
router.patch('/movies', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});


app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only