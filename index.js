var express = require('express');
var app = express();
var path = require('path');

app.use(require('body-parser')());
app.use(require('method-override')());
app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.set('views', path.join(__dirname,'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static(path.join(__dirname,'/public')));
app.use(require(__dirname + '/config/router')(express.Router()));

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Library Management System running at http://%s:%s', host, port);
});

