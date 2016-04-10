var express = require('express')
    , router = express.Router()
    , uri = require('url')
    , tumbrl = require('tumblr.js')
    , db = require('monkii')('localhost/umq')
    , playlist = db.get('playlist');

var tumbrl_client = tumbrl.createClient({
    consumer_key: '' // https://www.tumblr.com/oauth/apps
});

router.post('/', checkSource, getInfo, getAudio, addToPlaylist);

// TODO: move to generic source route
function checkSource(req, res, next) {
    if (!req.body.url) next(error(400, 'no url'));
    else if (~req.body.url.indexOf('a.tumblr')) {
        req.title = '';
        req.artist = '';
        req.url = req.body.url;
        next(); //should skip to addToPlaylist
    }
    else if (~req.body.url.indexOf('tumblr')) {
        next();
    } else {
        next(error(400, 'unsupported url'));
    }
}

function getInfo(req, res, next) {
    var url = req.body.url;
    req.blog = uri.parse(url).hostname;
    req.id = uri.parse(url).pathname.split('/')[2];

    tumbrl_client.posts(req.blog, { type: 'audio', id: req.id }, function (err, data) {
        if (err) next(error(400, 'cant reach tumbrl api - ' + err));
        if (data != undefined) {
            var post = data.posts[0];
            if (post != undefined) {
                // TODO make a track data structure
                req.title = post.track_name || '';
                req.artist = post.artist || '';
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
        req.url = 'http://a.tumblr.com/'+ audio_id +'o1.mp3';
    }
    next();
}

// TODO: move to generic source route
function addToPlaylist(req, res, next) {
    console.log('Adding to playlist:\n track name: %s\n url: %s', req.title, req.url);
    playlist.insert({
        title: req.title,
        artist: req.artist,
        url: req.url,
    }, function(err, doc) {
        if (err) next(error(400, 'cant insert - ' + err));
        res.status(200).redirect('/');
    });
}

// custom error handler
function error(status, msg) {
    console.log(msg);
    var err = new Error(msg);
    err.status = status;
    return err;
}

module.exports = router;
