CREATE TABLE ADMIN(
	adminid VARCHAR(10) PRIMARY KEY NOT NULL,
	afname VARCHAR(32) NOT NULL,
	alname VARCHAR(32) NOT NULL,
	apassword VARCHAR(32) NOT NULL
);

INSERT INTO ADMIN VALUES('ADMIN', 'MIN', 'AD', 'ADMINPASS');
INSERT INTO ADMIN VALUES('PENDING', 'PEN', 'DING', 'PENDINGPASS');

CREATE TABLE BOOK(
	bookid SERIAL PRIMARY KEY,
	bookname TEXT NOT NULL,
	publisher TEXT NOT NULL,
	yearpublished VARCHAR(4),
	availability BOOLEAN,
	nobkcopy INT,
	adminid VARCHAR(10) references ADMIN(adminid) NOT NULL
);

CREATE TABLE BOOK_AUTHOR(
	bookauthor TEXT,
	bookid INT references BOOK(bookid)
);

CREATE TABLE BOOK_GENRE(
	bookgenre TEXT,
	bookid INT references BOOK(bookid)
);

CREATE TABLE BORROWER(
	borrowerid VARCHAR(16) PRIMARY KEY NOT NULL,
	bfname VARCHAR(32) NOT NULL,
	blname VARCHAR(32) NOT NULL,
	bpassword VARCHAR(32) NOT NULL,
	adminid VARCHAR(10) references ADMIN(adminid) NOT NULL
);

CREATE TABLE STUDENT(
	borrowerid VARCHAR(16) references BORROWER(borrowerid) NOT NULL,
	studentno VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE TEACHER(
	borrowerid VARCHAR(16) references BORROWER(borrowerid) NOT NULL,
	empno VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE BORROWED_BY(
	bookid INT references BOOK(bookid) NOT NULL,
	borrowerid VARCHAR(10) references BORROWER(borrowerid) NOT NULL,
	borrowdate DATE NOT NULL,
	allowableday INT NOT NULL,
	returndate DATE, 
	duedate DATE NOT NULL
);

