var express = require('express')
    , router = express.Router()
    , uri = require('url')
    , request = require("request")
    , mongo_uri = process.env.MONGOLAB_URI || 'localhost/umq'
    , db = require('monkii')(mongo_uri)
    , playlist = db.get('playlist');

router.post('/', checkSource, getInfo, getAudio, addToPlaylist);

function checkSource(req, res, next) {
    if (!req.body.url) next(error(400, 'no url'));
    else if (~req.body.url.indexOf('youtube')) {
        next();
    } else
        next('route');
}

function getInfo(req, res, next) {
    req.url = req.body.url;
    var id = req.url.split('v=')[1];
    req.id = (~id.indexOf('&')) ? id.substring(0, id.indexOf('&')) : id;

    var info_url = 'http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v='
                 + req.id + '&format=json';

    request(info_url, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var info = JSON.parse(body);
            req.title = info.title;
            req.artist = ""; // not provided
        }
        next();
    });
}

function getAudio(req, res, next) {
    var video_id = req.url.split('v=')[1]; // TODO use regex
    video_id = video_id.substring(0, video_id.indexOf('&'));

    req.url = "http://www.youtube.com/v/"+ video_id +"?autoplay=1";

    if (video_id.length < 2) next(error(400, 'invalid video_id'));
    next();
}

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
    var err = new Error(msg);
    err.status = status;
    return err;
}

module.exports = router;
