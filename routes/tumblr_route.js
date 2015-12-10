var express = require('express')
    , router = express.Router()
    , pg = require('pg')
    , uri = require('url')
    , connectionString = process.env.DATAblog
    , tumblr = require('tumblr.js');
var tumblr_client = tumblr.createClient({
    consumer_key: 'yJIWyO77XkRvoRVGDLio6CIIic1jvMY4N1cENVCWlB3Wlwm0bX'
});

router.post('/', checkSource, parseURL, getInfo, getAudio, addToPlaylist);

// TODO move to generic source route
function checkSource(req, res, next) {
    if (!req.body.url) return next(error(400, 'no url'));
    // if (~url.indexOf('tumblr')) {
        next();
    // } else
        // next('route');
}

function parseURL(req, res, next) {
    var url = req.body.url;
    req.blog = uri.parse(url).hostname;
    req.id = uri.parse(url).pathname.split('/')[2];
    next();
}

function getInfo(req, res, next) {
    tumblr_client.posts(req.blog, { type: 'audio', id: req.id }, function (err, data) {
        if (err) next(error(400, 'cant reach tumbrl api - ' + err));

        var post = data.posts[0];
        req.track = post.track_name || ""; // TODO make a track data structure
        req.artist = post.artist || "";
        req.url = post.audio_url;
        next();
    });
}

function getAudio(req, res, next) {
    var audio_id = req.url.split('?')[0];
    if (~audio_id.lastIndexOf('/'))
        audio_id = audio_id.substring(audio_id.lastIndexOf('/') + 1);
    req.url = "http://a.tumblr.com/"+ audio_id +"o1.mp3";
    next();
}

// TODO move to generic source route
function addToPlaylist(req, res, next) {
    pg.connect(connectionString, function (err, client, done) {
        if (err) next(error(400, 'cant connect to db -'  + err));

        var query = 'INSERT INTO playlist (position, title, artist, url) VALUES($1, $2, $3, $4)';
        client.query(query, [0, req.track, req.artist, req.url], function (err, result) {
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
