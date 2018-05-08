var express = require('express')
var app = express();
var path = require('path');

/* GET Home Page */
router.get('/', function(req, res, next){
	res.render('index'}
});

router.get('login', function(req, res, next){
	res.render('login'}
});

module.exports = router;