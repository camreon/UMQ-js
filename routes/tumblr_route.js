var express = require('express')
    , router = express.Router()
    , pg = require('pg')
    , uri = require('url')
    , connectionString = process.env.DATABASE_URL
    , tumblr = require('tumblr.js');

var tumblr_client = tumblr.createClient({
    consumer_key: 'yJIWyO77XkRvoRVGDLio6CIIic1jvMY4N1cENVCWlB3Wlwm0bX'
});

function checkSource(req, res, next) {
    var url = req.body.url;

    if (!url) return next(error(400, 'no url'));
    if (~url.indexOf('tumblr')) {
        req.url = url;
        next();
    } else
        next('route');
}

function parseURL(req, res, next) {
    req.base_url = uri.parse(req.url).hostname;
    req.id = uri.parse(req.url).pathname.split('/')[2];
    next();
}

function getInfo(req, res, next) {
    tumblr_client.posts(req.base_url, { type: 'audio', id: req.id }, function (err, data) {
        if (err) next(error(400, 'cant reach tumbrl api - ' + err));

        var post = data.posts[0];
        req.track = post.track_name || "";
        req.artist = post.artist || "";
        req.audio = post.audio_url;
        next();
    });
}

function addToPlaylist(req, res, next) {
    pg.connect(connectionString, function (err, client, done) {
        if (err) next(error(400, 'cant connect to db -'  + err));

        var query = 'INSERT INTO playlist (position, title, artist, url) VALUES($1, $2, $3, $4)';
        client.query(query, [0, req.track, req.artist, req.audio], function (err, result) {
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