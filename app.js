var express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , app = express()
  , mongo_uri = process.env.MONGOLAB_URI
  , db = require('monkii')(mongo_uri)
  , playlist = db.get('playlist');

var sources = [
      require('./sources/youtube')
    , require('./sources/bandcamp')
    , require('./sources/tumbrl')
];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    var tracks = playlist.find({}, {sort: {_id: 1}}, function (err, docs){
        res.render('index', { playlist: docs });
    });
});

app.get('/playlist/:id', function (req, res, next) {
    playlist.find({ _id: req.params.id }, function(err, doc) {
        if (err) next(error(404, 'no result for track #' + id));
        var track = doc[0];
        res.send(track ? track.url : 'track #' + id + ' doesnt exist');
    });
});

app.get('/delete/:id', function (req, res, next) {
    var query = { _id: req.params.id };
    if (req.params.id == 'all')
        query = {};
    playlist.remove(query, function(err) {
        if (err) next(error(400, 'cant delete - ' + err));
        res.redirect('/');
    });
});

// dynamically create routes
sources.forEach(function(src) {
    app.post('/playlist', src.check, src.info, src.audio, addToPlaylist);
});

app.post('/playlist', function(req, res, next) {
    next(error(400, 'unsupported url'));
});


function addToPlaylist(req, res, next) {
    if (req.url.length < 10)
        next(error(400, 'invalid audio URL: ' + req.url));
    else {
        playlist.insert({
            title: req.title,
            artist: req.artist,
            url: req.url,
        }, function(err, doc) {
            if (err) next(error(400, 'cant insert - ' + err));
            console.log('Added to playlist:\n track name: %s\n url: %s', req.title, req.url);
            res.status(200).redirect('/');
        });
    }
}

// custom error handler
function error(status, msg) {
    console.log(msg);
    var err = new Error(msg);
    err.status = status;
    return err;
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('not found')
    err.status = 404;
    next(err);
});

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler w/ no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
