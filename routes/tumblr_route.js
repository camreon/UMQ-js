var express = require('express')
    , router = express.Router()
    , pg = require('pg')
    , uri = require('url')
    , connectionString = process.env.DATAblog
    , tumblr = require('tumblr.js');
var tumblr_client = tumblr.createClient({
    consumer_key: 'yJIWyO77XkRvoRVGDLio6CIIic1jvMY4N1cENVCWlB3Wlwm0bX'
    // move out of version control into config file
});

router.post('/', [checkSource, getInfo, getAudio, addToPlaylist]);

// TODO move to generic source route
function checkSource(req, res, next) {
    if (!req.body.url) return next(error(400, 'no url'));
    else if (~req.body.url.indexOf('a.tumblr')) {
        req.track = req.body.url;
        req.artist = "";
        req.url = req.body.url;
        next(); //should skip to addToPlaylist
    }
    else if (~req.body.url.indexOf('tumblr')) {
        next();
    } else
        next(error(400, 'unsupported url'));
}

function getInfo(req, res, next) {
    var url = req.body.url;
    req.blog = uri.parse(url).hostname;
    req.id = uri.parse(url).pathname.split('/')[2];

    tumblr_client.posts(req.blog, { type: 'audio', id: req.id }, function (err, data) {
        console.log(err);
        if (err) next(error(400, 'cant reach tumbrl api - ' + err));
        if (data != undefined) {
            var post = data.posts[0];
            if (post != undefined) {
                req.track = post.track_name || ""; // TODO make a track data structure
                req.artist = post.artist || "";
                req.url = post.audio_url;
            }
        }
        next();
    });
}

function getAudio(req, res, next) {
    var audio_id = req.url.split('?')[0];
    if (~audio_id.lastIndexOf('/')) {
        audio_id = audio_id.substring(audio_id.lastIndexOf('/') + 1);
        req.url = "http://a.tumblr.com/"+ audio_id +"o1.mp3";
    }
    next();
}

// todo: move to base route
function addToPlaylist(req, res, next) {
    console.log('Adding to playlist:\n track name: %s\n url:%s', req.track, req.url);
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
