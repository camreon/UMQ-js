var request = require('request')
    , cheerio = require('cheerio')
    , json_minify = require('node-json-minify');


exports.check = function(req, res, next) {
    if (!req.body.url) {
        next(new Error('no url'));
    } else if (~req.body.url.indexOf('popplers5')) {
         // || ~req.body.url.indexOf('bcbits')
        req.title = "";
        req.artist = "";
        req.url = req.body.url;
        next('route');
    } else if (~req.body.url.indexOf('bandcamp')) {
        next();
    } else {
        next('route');
    }
}

exports.info = function(req, res, next) {
    request(req.body.url, function (err, res, html) {
        if (!err && res.statusCode === 200) {
            var data_name = 'var TralbumData';
            var $ = cheerio.load(html);
            var script = $('script').filter(function () {
                return (~$(this).text().indexOf(data_name));
            });
            var album = extractJSON(data_name, script.text());
            req.track = album.trackinfo[0];
            req.title = req.track.title || '';
            req.artist = album.artist || '';
        }
        next();
    });
}

// TODO: create embed player link from album & track ids
exports.audio = function(req, res, next) {
    if (req.track != undefined && req.track.file != undefined)
        req.url = req.track.file['mp3-128'];

    if (!req.url || req.url.length <= 1) next(new Error('cant get audio for ' + req.body.url));
    next();
}

function extractJSON(json_name, text) {
    text = text.substr(text.indexOf(json_name));
    text = text.substring(text.indexOf('{'), text.indexOf(';'));
    return eval("(" + text + ")"); // lol
}
