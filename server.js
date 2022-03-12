/*
CSC3916 HW3
File: Server.js
Description: Web API scaffolding for Movie API
 */
require('dotenv').config();
var express = require('express');
//var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
db = require('./db')(); //hack
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');

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

        //res.json({username: user.username, password: user.password})

        user.pre('save', function(err){
            if (err) {
                if (err.code == '11000') {
                    res.json({success: false, message: 'A user with that username already exists.'});
                } else {
                    res.json(err);
                }

                res.json({success: true, msg: 'Successfully created new user.'})
            }
        });
        /*
        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });

         */
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
    var user = db.findOne(req.body.username);

    if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
        if (req.body.password == user.password) {
            var userToken = { id: user.id, username: user.username };
            var token = jwt.sign(userToken, process.env.SECRET_KEY);
            res.json({success: true, token: 'JWT ' + token});
        }
        else {
            res.status(401).send({success: false, msg: 'Authentication failed.'});
        }
    }
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
router.route('/movies')
    .get(function (req, res) {
            console.log(req.body);
            res = res.status(200);
            if(req.get('Content-Type')){
                console.log("Content-Type: " + req.get('Content-Type'));
                res = res.type(req.get('Content-Type'));
            }
            var o = getJSONObjectForMovieRequirement(req);
            res.status(200).send({status: 200, msg: 'GET movies', headers: o.headers, query: req.query, env: o.key});
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
            res.status(200).send({status: 200, msg: 'movie saved', headers: o.headers, query: req.query, env: o.key});
        }
    )
    .put(authController.isAuthenticated, function(req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                res = res.type(req.get('Content-Type'));
            }
            var o = getJSONObjectForMovieRequirement(req);
            res.status(200).send({status: 200, msg: 'movie updated', headers: o.headers, query: req.query, env: o.key});
        }
    );

router.delete('/movies', function (req, res) {
    console.log(req.body);
    res = res.status(200);
    if (req.get('Content-Type')) {
        res = res.type(req.get('Content-Type'));
    }
    var o = getJSONObjectForMovieRequirement(req);
    res.status(200).send({status: 200, msg: 'movie deleted', headers: o.headers, query: req.query, env: o.key});
});

router.patch('/movies', function (req, res) {
    res.status(401).send({success: false, msg: 'Does not support the HTTP method.'});
});

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only