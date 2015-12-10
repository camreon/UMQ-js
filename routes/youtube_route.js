var express = require('express')
    , router = express.Router()
    , pg = require('pg')
    , uri = require('url')
    , connectionString = process.env.DATABASE_URL
    , request = require("request");

router.post('/', checkSource, parseURL, getInfo, getAudio, addToPlaylist);

function checkSource(req, res, next) {
    if (!req.body.url) return next(error(400, 'no url'));
    if (~req.body.url.indexOf('youtube')) {
        next();
    } else
        next('route');
        // next(error(400, 'unsupported url'));
}

function parseURL(req, res, next) {
    req.url = req.body.url;
    var id = req.url.split('v=')[1];
    req.id = (~id.indexOf('&')) ? id.substring(0, id.indexOf('&')) : id;
    next();
}

function getInfo(req, res, next) {
    var info_url = 'http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v='
                 + req.id + '&format=json';

    request(info_url, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var info = JSON.parse(body);
            req.title = info.title;
            req.artist = ""; // not provided
            next();
        }
    });
}

function getAudio(req, res, next) {
    var video_id = req.url.split('v=')[1]; // TODO use regex
    if(~video_id.indexOf('&')) video_id = video_id.substring(0, video_id.indexOf('&'));
    req.url = "http://www.youtube.com/v/"+ video_id +"?autoplay=1";
    next();
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

// custom error handler
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}

module.exports = router;
