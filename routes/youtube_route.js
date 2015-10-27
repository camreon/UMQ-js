var express = require('express')
    , router = express.Router()
    , pg = require('pg')
    , uri = require('url')
    , connectionString = process.env.DATABASE_URL
    , request = require("request");


function checkSource(req, res, next) {
    var url = req.body.url;

    if (!url) return next(error(400, 'no url'));
    if (~url.indexOf('youtube')) {
        req.url = url;
        next();
    } else
        next(error(400, 'unsupported url'));
}

function parseURL(req, res, next) {
    var id = req.url.split('v=')[1];
    var ampersand = id.indexOf('&');

    if(ampersand != -1) req.id = id.substring(0, ampersand);
    else                req.id = id;

    next();
}

function getInfo(req, res, next) {
    var info_url = 'http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v='
                 + req.id + '&format=json';

    request(info_url, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var info = JSON.parse(body);
            req.title = info.title;
            req.artist = ""; //TODO

            next();
        }
    });
}

function addToPlaylist(req, res, next) {
    pg.connect(connectionString, function (err, client, done) {
        if (err) next(error(400, 'cant connect to db -'  + err));

        var query = 'INSERT INTO playlist (position, title, artist, url) VALUES($1, $2, $3, $4)';
        client.query(query, [0, req.title, req.artist, req.url], function (err, result) {
            done();
            if (err) next(error(400, 'cant insert - ' + err));
            res.redirect('/');
        });
    });
}

router.post('/', checkSource, parseURL, getInfo, addToPlaylist);


// custom error handler
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}

module.exports = router;
