var pg = require('pg');
var conString = 'postgres://lmsgrp3:127127@127.0.0.1/lms';
				//'postgres://username:password@localhost/database';		
var user;
var books = [];
var brrwdBooks = [];

pg.connect(conString, function(err, client, done) {
	if (err) {
		return console.error('error fetching client from pool', err);
	}
	var query = client.query("select bookid, bookname, publisher, yearpublished, availability, nobkcopy, adminid, string_agg(bookauthor, ',') as bookauthor, string_agg(bookgenre, ',') as bookgenre from book b NATURAL JOIN book_author NATURAL JOIN book_genre GROUP BY b.bookid;");
	query.on("row", function(row){
		books.push(row);
	});
	query.on("end", function(row){
		done();

		var jsonfile = require('jsonfile')

		var file = "public/scripts/data.json";

		jsonfile.writeFile(file, books, function(err) {	});
	});
});

exports.borrower = function(req, res){
	return res.json(user);
};

exports.home = function (req, res, next){
	res.render('../views/Borrower/homeborrower.html');
};

exports.borrow = function (req, res, next){
	res.render('../views/Borrower/borrow.html');
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
			
			jsonfile.writeFile(file, books, function(err) {	});
			res.render('../views/Borrower/viewallbooks.html');
		});
	});
};

exports.borrowedbooks = function (req, res, next){
	res.render('../views/Borrower/borrowedbooks.html');
};

exports.duebooks = function (req, res, next){
	res.render('../views/Borrower/booksdue.html');
};

exports.logInFxn = function(req, res){
	user = null;
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		var queryString;
		var tempUser;
		if(req.body.type == "Student") queryString = "SELECT * FROM student WHERE borrowerid=$1 AND studentno=$2;"
		else queryString = "SELECT * FROM teacher WHERE borrowerid=$1 AND empno=$2;"

		var getUserQuery = client.query(queryString, [req.body.bid, req.body.addInfo]);
		
		getUserQuery.on("error", function(err){ console.log(err); done()});
		
		getUserQuery.on("row", function(subUser){ tempUser = subUser; });
		
		getUserQuery.on("end", function(){
			done();
			if(tempUser == null){
				status = "No Account Found!";
				res.render('../views/login2.html');
			}else{
				var newQuery = client.query("SELECT * FROM borrower where borrowerid=$1 and bpassword=$2",[tempUser.borrowerid, req.body.bpass]);				
				
				newQuery.on("error", function(err){ console.log(err); done()});
				
				newQuery.on("row", function(borrower){ user = borrower; });
				
				newQuery.on("end", function(){
					done();
					if(user == null){
						status = "No Account Found";
						res.render('../views/login2.html');
					} else {
						res.render('../views/Borrower/homeborrower.html');
					}
				});
			}
		});
	});
}

exports.getBooks = function(req, res){
	return res.json(books);
};

exports.getBorrowedBooks = function(req, res){
	brrwdBooks = [];
	pg.connect(conString, function(err, client, done){
		if(err) { return console.error('error fething client from pool', err); };
		
		var getQuery = client.query("SELECT * from borrowed_by where borrowerid=$1 ORDER BY bookid ASC", [user.borrowerid]);
		getQuery.on("error", function(err){ console.log(err); done(); }); 
		getQuery.on("row", function(data){ brrwdBooks.push(data); });
		getQuery.on("end", function(){	return res.json(brrwdBooks); });
	});
};

exports.booksDue = function(req, res){
	dueBooks = [];
	pg.connect(conString, function(err, client, done){
		if(err) { return console.error('error fething client from pool', err); };
		
		var getQuery = client.query("SELECT * from borrowed_by where borrowerid=$1 and duedate<=Current_date", [user.borrowerid]);
		getQuery.on("error", function(err){ console.log(err); done(); }); 
		getQuery.on("row", function(data){ dueBooks.push(data); });
		getQuery.on("end", function(){	return res.json(dueBooks); });
	});
};

exports.returnBookFxn = function (req, res, next){
	books = [];
	pg.connect(conString, function(err, client, done){
		if(err) { return console.error('error fething client from pool', err); };
		
		var removeQuery = client.query("DELETE from borrowed_by where borrowerid=$1 and bookid=$2", [user.borrowerid, req.body.book]);
		removeQuery.on("error", function(err){ console.log(err); done(); }); 
		removeQuery.on("end", function(){	
			var updateQuery = client.query("UPDATE book SET nobkcopy = nobkcopy+1, availability=true WHERE bookid=$1;", [req.body.book]);
			
			updateQuery.on("end", function(){
				done();
				var query = client.query("select bookid, bookname, publisher, yearpublished, availability, nobkcopy, adminid, string_agg(bookauthor, ',') as bookauthor, string_agg(bookgenre, ',') as bookgenre from book b NATURAL JOIN book_author NATURAL JOIN book_genre GROUP BY b.bookid;");
				query.on("row", function(row){
					books.push(row);
				});
				query.on("end", function(row){
					done();

					var jsonfile = require('jsonfile')

					var file = "public/scripts/data.json";

					jsonfile.writeFile(file, books, function(err) {	});
					res.render("../views/Borrower/homeborrower.html");
				});
			});
		});
	});
};


exports.borrowBookFxn = function (req, res, next){
	var check = false;
	pg.connect(conString, function(err, client, done){
		if(err) { return console.error('error fething client from pool', err); };
		
		var insertQuery = client.query("INSERT INTO borrowed_by VALUES($1, $2, CURRENT_DATE, 7, NULL, CURRENT_DATE + 7)",[req.body.book, user.borrowerid]);
		
		insertQuery.on("error", function(err){console.log(err); done(); });

		insertQuery.on("end", function(){
			var updateQuery = client.query("UPDATE book SET nobkcopy = nobkcopy-1 WHERE bookid=$1 returning nobkcopy;", [req.body.book]);

			updateQuery.on("row", function(newQty){
				if(newQty.nobkcopy==0){
					var subQuery = client.query("UPDATE book SET availability = false WHERE bookid=$1;", [req.body.book]);
				}
			});

			updateQuery.on("end", function(){
				var query = client.query("select bookid, bookname, publisher, yearpublished, availability, nobkcopy, adminid, string_agg(bookauthor, ',') as bookauthor, string_agg(bookgenre, ',') as bookgenre from book b NATURAL JOIN book_author NATURAL JOIN book_genre GROUP BY b.bookid;");
				query.on("row", function(row){
					books.push(row);
				});
				query.on("end", function(row){
					done();

					var jsonfile = require('jsonfile')

					var file = "public/scripts/data.json";

					jsonfile.writeFile(file, books, function(err) {	});
					res.render('../views/Borrower/homeborrower.html');
				});
			});
		});
	});
};
