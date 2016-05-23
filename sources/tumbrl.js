var uri = require('url')
  , tumbrl = require('tumblr.js')
  , tumbrl_client = tumbrl.createClient({
        consumer_key: process.env.TUMBLR_API_KEY // https://www.tumblr.com/oauth/apps
    });


exports.check = function(req, res, next) {
    if (!req.body.url) {
        next(new Error('no url'));
    } else if (~req.body.url.indexOf('a.tumblr')) {
        req.title = '';
        req.artist = '';
        req.url = req.body.url;
        next(); // TODO: should skip to addToPlaylist
    } else if (~req.body.url.indexOf('tumblr')) {
        next();
    } else {
        next('route');
        // next(error(400, 'unsupported url'));
    }
}

exports.info = function(req, res, next) {
    var url = req.body.url;
    req.blog = uri.parse(url).hostname;
    req.id = uri.parse(url).pathname.split('/')[2];

    tumbrl_client.posts(req.blog, { type: 'audio', id: req.id }, function (err, data) {
        if (err) next(new Error('cant reach tumbrl api - ' + err));
        if (data != undefined && data.posts[0] != undefined) {
            // TODO: make a track data structure
            var post = data.posts[0];
            req.title = post.track_name || '';
            req.artist = post.artist || '';
            req.url = post.audio_url;
        }
        next();
    });
}

exports.audio = function(req, res, next) {
    var audio_id = req.url.split('?')[0];
    if (~audio_id.lastIndexOf('/')) {
        audio_id = audio_id.substring(audio_id.lastIndexOf('/') + 1);
        req.url = 'http://a.tumblr.com/'+ audio_id +'o1.mp3';
    }
    next();
}
