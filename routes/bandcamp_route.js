var express = require('express')
    , router = express.Router()
    , pg = require('pg')
    , request = require('request')
    , cheerio = require('cheerio')
    , json_minify = require('node-json-minify')
    , connectionString = process.env.DATABASE_URL;


router.post('/', checkSource, getInfo, getAudio, addToPlaylist);

function checkSource(req, res, next) {
    if (!req.body.url) return next(error(400, 'no url'));
    if (~req.body.url.indexOf('bandcamp')) next();
    else next('route');
        // next(error(400, 'unsupported url'));
}

function getInfo(req, res, next) {
    request(req.body.url, function (err, res, html) {
        if (!err && res.statusCode === 200) {
            var data_name = 'var TralbumData';
            var $ = cheerio.load(html);

            var script = $('script').filter(function () {
                return (~$(this).text().indexOf(data_name));
            });

            var text = script.text();
            var album = extractJSON(data_name, text);
            req.track = album.trackinfo[0]; // TODO add multiple tracks from album

            req.title = req.track.title || '';
            req.artist = album.artist || '';
            next();
        } else {
            next(error(404, err));
        }
    });
}

function extractJSON(json_name, text) {
    text = text.substr(text.indexOf(json_name));
    text = text.substring(text.indexOf('{'), text.indexOf(';'));
    return eval("(" + text + ")");
}

function getAudio(req, res, next) {
    req.url = req.track.file['mp3-128'];
    if (!req.url) next(error(400, 'cant get audio for ' + req.body.url));
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
