var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'UMQ' });
});

module.exports = router;




// DEPLOY
// set DEBUG=UMQ2 & node ./bin/www