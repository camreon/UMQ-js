// var express = require('express')
//     , router = express.Router()
//     , pg = require('pg')
//     , connectionString = process.env.DATAblog;


// router.post('/', addToPlaylist);

// function addToPlaylist(req, res, next) {
//     console.log('hit addToPlaylist route');

//     pg.connect(connectionString, function (err, client, done) {
//         if (err) next(error(400, 'cant connect to db -'  + err));

//         var query = 'INSERT INTO playlist (position, title, artist, url) VALUES($1, $2, $3, $4)';
//         client.query(query, [0, req.track, req.artist, req.url], function (err, result) {
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
