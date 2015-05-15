var express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , users = require('./routes/users')
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

app.use('/users', users);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.get('/', function(req, res) {
    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        query = client.query('SELECT * FROM playlist;');

        query.on('row', function(row) {
            results.push(row.url);
        });
        query.on('end', function() {
            client.end();
            res.render('index', { playlist: results })
        });

        if (err) { console.log(err); }
    });
});

app.post('/playlist', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        query = client.query('INSERT INTO playlist (url) VALUES($1)',
                             [req.body.url]);

        query.on('end', function() {
            client.end();
            res.redirect('/');
        });

        if (err) { console.log(err); }
    });
});
  // .put(function(req, res) {
  //   res.send('Update the book');
  // });


module.exports = app;
