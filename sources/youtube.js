var uri = require('url')
  , request = require("request");


exports.check = function(req, res, next) {
    if (!req.body.url) next(new Error('no url'));
    else if (~req.body.url.indexOf('youtube')) {
        next();
    } else
        next('route');
}

exports.info = function(req, res, next) {
    req.url = req.body.url;
    var id = req.url.split('v=')[1];
    req.id = (~id.indexOf('&')) ? id.substring(0, id.indexOf('&')) : id;

    var info_url = 'http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v='
                 + req.id + '&format=json';

    request(info_url, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var info = JSON.parse(body);
            req.title = info.title;
            req.artist = ""; // N/A
            // } else {
            // next(new Error('youtube info unavailable'));
        }
        next();
    });
}

exports.audio = function(req, res, next) {
    req.url = "http://www.youtube.com/v/"+ req.id +"?autoplay=1";

    if (req.id.length < 2) {
        var err = new Error('invalid video_id: ' + req.id);
        err.status = 400;
        next(err);
    }
    next();
}
