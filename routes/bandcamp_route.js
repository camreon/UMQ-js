var express = require('express')
    , router = express.Router()
    , request = require('request')
    , cheerio = require('cheerio')
    , json_minify = require('node-json-minify')
    , db = require('monkii')('localhost/umq')
    , playlist = db.get('playlist')
    , autoIncrement = require("mongodb-autoincrement");


router.post('/', checkSource, getInfo, getAudio, addToPlaylist);

function checkSource(req, res, next) {
    if (!req.body.url) next(error(400, 'no url'));
    else if (~req.body.url.indexOf('bandcamp')) next();
    else if (~req.body.url.indexOf('popplers5')) {
       // || ~req.body.url.indexOf('bcbits')
        req.title = "";
        req.artist = "";
        req.url = req.body.url;
        next();
    }
    else next('route');
}

function getInfo(req, res, next) {
    if (req.url.length <= 1) {
        request(req.body.url, function (err, res, html) {
            if (!err && res.statusCode === 200) {
                var data_name = 'var TralbumData';
                var $ = cheerio.load(html);

                var script = $('script').filter(function () {
                    return (~$(this).text().indexOf(data_name));
                });

                var album = extractJSON(data_name, script.text());
                req.track = album.trackinfo[0]; // TODO: add multiple tracks from album
                req.title = req.track.title || '';
                req.artist = album.artist || '';
            }
            next();
        });
    } else {
        next();
    }
}

function extractJSON(json_name, text) {
    text = text.substr(text.indexOf(json_name));
    text = text.substring(text.indexOf('{'), text.indexOf(';'));
    return eval("(" + text + ")"); // lol
}

function getAudio(req, res, next) {
    if (req.track != undefined && req.track.file != undefined)
        req.url = req.track.file['mp3-128'];

    if (!req.url || req.url.length <= 1) next(error(400, 'cant get audio for ' + req.body.url));
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
    console.log(msg);
    var err = new Error(msg);
    err.status = status;
    return err;
}

module.exports = router;
