var pg = require('pg');
var conString = 'postgres://lmsgrp3:127127@127.0.0.1/lms';
				//'postgres://username:password@localhost/database';
var books = [];
var availBooks = [];

pg.connect(conString, function(err, client, done) {
	if (err) {
		return console.error('error fetching client from pool', err);		
	}
});

exports.home = function (req, res, next){
	res.render('../views/home.html');
};

exports.login = function (req, res, next){
	res.render('../views/login.html');
};


exports.statusReport = function(req, res){
	return res.json(status);
}

exports.addAccount = function (req, res, next){
		var subQueryStr;
		if(req.body.type=="Student") subQueryStr = "INSERT INTO student VALUES($1, $2)";
		else subQueryStr = "INSERT INTO teacher VALUES($1, $2)";
		
		pg.connect(conString, function(err, client, done) {
			if (err) {
			
				return console.error('error fetching client from pool', err);
			}
			var insertQuery = client.query("INSERT INTO borrower VALUES($1, $2, $3, $4, 'PENDING')", [req.body.bid, req.body.fname, req.body.lname, req.body.pass1]);
			insertQuery.on("error", function(err){ console.log(err); done();});
			
			insertQuery.on("end", function(){
				done();
				var subInsertQuery = client.query(subQueryStr, [req.body.bid, req.body.addInfo]);
				
				subInsertQuery.on("error", function(err){ console.log(err) });
				
				subInsertQuery.on("end", function(){ 

					done(); 
					res.render('../views/home.html');
				});	
			});
		});
}

exports.loginadmin = function (req, res, next){
	res.render('../views/adminlogin.html');
};

exports.signup = function (req, res, next){
	res.render('../views/sign-up.html');
};

exports.getBooks = function(req, res){
	return res.json(books);
}

exports.getAvailBooks = function(req, res){
	return res.json(availBooks);
}

