// var express = require('express')
//     , router = express.Router()
//     , pg = require('pg')
//     , connectionString = process.env.DATAblog;

// router.post('/', function(req, res, next) {
//     console.log('hit source_route');
//     next();
// },
// trackExists, addToPlaylist);

// function trackExists(req, res, next) {
//     if (req.url.length < 2)
//         next(error(400, 'couldn\'t get an audio url'));
//     else
//         next();
// }

// function addToPlaylist(req, res, next) {
//     console.log('Adding to playlist:\n track name: %s\n url:%s', req.title, req.url);
//     pg.connect(connectionString, function (err, client, done) {
//         if (err) next(error(400, 'cant connect to db -'  + err));

//         var query = 'INSERT INTO playlist (position, title, artist, url) VALUES($1, $2, $3, $4)';
//         client.query(query, [0, req.title, req.artist, req.url], function (err, result) {
//             done();
//             if (err) next(error(400, 'cant insert - ' + err));
//             res.redirect('/');
//         });
//     });
// }

// // custom error handler
// function error(status, msg) {
//     var err = new Error(msg);
//     err.status = status;
//     return err;
// }

// module.exports = router;
