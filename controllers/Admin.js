var pg = require('pg');
var conString = 'postgres://lmsgrp3:127127@127.0.0.1/lms';
				//'postgres://username:password@localhost/database';
								
var admin;

pg.connect(conString, function(err, client, done) {
	if (err) {
		return console.error('error fetching client from pool', err);
	}
});


exports.admin = function(req, res){
	return res.json(admin);
}

exports.getBorrowers = function(req, res, next){
	var borrowers = [];

	pg.connect(conString, function(err, client, done){
		if(err){
			done();
			console.log(err);
			return res.status(500).json({success: false, data:err});
		}
		
		var query = client.query("SELECT * FROM borrower;");
		query.on("row", function(row){
			borrowers.push(row);
		});
		
		query.on("end", function(row){
			done();
			return res.json(borrowers);
		});
	});
}

exports.allborrowers = function(req, res, next){
	res.render('../views/Admin/allborrowers.html');
};

exports.approve = function(req, res, next){
	res.render('../views/Admin/approve.html');
}

exports.pending = function(req, res, next){
	var borrowers = [];
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}	
		var pending = [];
		var query = client.query("SELECT * FROM borrower WHERE adminid='PENDING';");
		query.on("row", function(row){
			borrowers.push(row);
		});
		query.on("end", function(row){
			done();
			return res.json(borrowers);
		});
	});
}

exports.home = function (req, res, next){
	res.render('../views/Admin/homeadmin.html');
};


exports.addbook = function (req, res, next){
	res.render('../views/Admin/add.html');
};

exports.addbookFxn = function (req, res, next){
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		} else{
			var subQueryStr = client.query("INSERT INTO book (bookname, publisher, yearpublished, availability, nobkcopy, adminid) VALUES ($1, $2, $3, true, $4, $5) RETURNING bookid", [req.body.bkname, req.body.bkpub, req.body.bkyrpub, req.body.nobkcpy, admin.adminid]);
			subQueryStr.on("error", function(err){ console.log(err); done(); });
			subQueryStr.on("row", function(bookId){ 
				for(var i = 0; i < req.body.bkauthor.length; i++){				
					var authorQuery = client.query("INSERT INTO book_author VALUES ($1, $2);", [req.body.bkauthor[i], bookId.bookid]);	
				}
				for(var j = 0; j < req.body.bkgenre.length; j++){				
					var genreQuery = client.query("INSERT INTO book_genre VALUES ($1, $2);", [req.body.bkgenre[j], bookId.bookid]);
				}
			});
			subQueryStr.on("end", function(){	
				done();	
				res.render('../views/Admin/homeadmin.html');
			});
		}
	});
}

exports.approve = function (req, res, next){
	res.render('../views/Admin/approve.html');
};

exports.allbooks = function (req, res, next){
	var books = [];

	pg.connect(conString, function(err, client, done){
		if(err){
			done();
			console.log(err);
			return res.status(500).json({success: false, data:err});
		}
		
		var query = client.query("select bookid, bookname, publisher, yearpublished, availability, nobkcopy, adminid, string_agg(bookauthor, ',') as bookauthor, string_agg(bookgenre, ',') as bookgenre from book b NATURAL JOIN book_author NATURAL JOIN book_genre GROUP BY b.bookid;");
		query.on("row", function(row){
			books.push(row);
		});
		query.on("end", function(row){
			done();

			var jsonfile = require('jsonfile')

			var file = "public/scripts/data.json";
			
			jsonfile.writeFile(file, books, function(err) { });
			res.render('../views/Admin/allbooks.html');
		});
	});
};

exports.borrowedbooks = function (req, res, next){
	var books = [];

	pg.connect(conString, function(err, client, done){
		if(err){
			done();
			console.log(err);
			return res.status(500).json({success: false, data:err});
		}
		
		var query = client.query("select bookname, borrowerid, bookid, borrowdate, duedate from book natural join borrowed_by;");
		query.on("row", function(row){
			books.push(row);
		});
		query.on("end", function(row){
			done();

			var jsonfile = require('jsonfile')

			var file = "public/scripts/data.json";
			
			jsonfile.writeFile(file, books, function(err) { });
			res.render('../views/Admin/borrowed.html');
		});
	});
};
                 
exports.duebooks = function (req, res, next){
	res.render('../views/Admin/due.html');
};

exports.logInAdminFxn = function (req, res){
	admin = null;
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var adminQuery = client.query("SELECT * FROM admin WHERE adminid=$1 and apassword=$2", [req.body.adminid, req.body.adminpass]);
		adminQuery.on("error",function(err){ console.log(err); done(); });
		adminQuery.on("row",function(data){ admin = data; });
		adminQuery.on("end",function(){
			done();
			if(admin == null) res.render('../views/home.html');
			else res.render('../views/Admin/homeadmin.html');
		});
	});
}			

exports.manageUser = function(req, res, next){
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}

		if(req.body.action == "ACCEPT"){
			var updateQuery = client.query("UPDATE borrower SET adminid=$1 where borrowerid=$2", [admin.adminid, req.body.borrower]);
			
			updateQuery.on("error", function(err){ console.log(err); done(); });
			updateQuery.on("end", function(){ done();});
		} else if(req.body.action == "REJECT"){
			var deleteStudent = client.query("DELETE FROM student where  borrowerid=$1", [req.body.borrower]);
			var deleteTeacher = client.query("DELETE FROM teacher where  borrowerid=$1", [req.body.borrower]);
			var deleteBorrower = client.query("DELETE FROM borrower where  borrowerid=$1", [req.body.borrower]);
		}
		res.render('../views/Admin/homeadmin.html');
	});
}		

exports.getBorrowedBook = function(req, res){
	var result = [];
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
	
		var getQuery = client.query("select bookname, borrowerid, borrowdate, duedate from borrowed_by natural join book;");
			getQuery.on("error", function(err){ console.log(err); done(); });
			getQuery.on("row", function(data){ result.push(data);});
			getQuery.on("end", function(){ return res.json(result);});
	});
}

exports.getDueBook = function(req, res){
	var result = [];
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
	
		var getQuery = client.query("select bookname, borrowerid, borrowdate, duedate from borrowed_by natural join book where duedate <= current_date;");
			getQuery.on("error", function(err){ console.log(err); done(); });
			getQuery.on("row", function(data){ result.push(data);});
			getQuery.on("end", function(){ return res.json(result);});
	});
}
