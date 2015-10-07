var express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , app = express()
  , pg = require('pg')
  , connectionString = process.env.DATABASE_URL;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/playlist', require('./routes/tumblr_route'));

app.get('/', function (req, res) {
    pg.connect(connectionString, function (err, client, done) {
        if (err) next(error(400, 'cant connect to pg'));

        client.query('SELECT * FROM playlist;', function (err, result) {
            done();
            if (err) next(error(400, 'cant select'));
            res.render('index', { playlist: result.rows })
        });
    });
});

// app.delete('/playlist', function (req, res, next) {});


// custom error handler
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
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
