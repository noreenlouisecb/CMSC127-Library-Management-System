// config/router.js
var PageController = require('./../controllers/PageController');
var Admin = require('./../controllers/Admin');
var Borrower = require('./../controllers/Borrower');

module.exports = function (router) {
/* Home */
	router.route('/')
		.get(PageController.home);
				
	router.route('/login')
		.get(PageController.login)
		.post(Borrower.logInFxn);

	router.route('/signup')
		.get(PageController.signup)
		.post(PageController.addAccount);

	router.route('/loginadmin')
		.get(PageController.loginadmin)
		.post(Admin.logInAdminFxn);

/* Borrower */	
	router.route('/allBooks')
		.get(Borrower.getBooks);

	router.route('/getAllBorrowedBooks')
		.get(Borrower.getBorrowedBooks);

	router.route('/borrower/loggedIn')
		.get(Borrower.borrower);

	router.route('/borrower')
		.get(Borrower.home);
	
	router.route('/borrower/borrow')
		.get(Borrower.borrow)
		.post(Borrower.borrowBookFxn);
		
	router.route('/borrower/allbooks')
		.get(Borrower.allbooks);
		
	router.route('/borrower/borrowedbooks')
		.get(Borrower.borrowedbooks)
		.post(Borrower.returnBookFxn);
		
	router.route('/borrower/duebooks')
		.get(Borrower.duebooks);
		
	router.route('/borrower/getDueBooks')
		.get(Borrower.booksDue);
	
/* Admin */	
	router.route('/admin/loggedIn')
		.get(Admin.admin);

	router.route('/admin')
		.get(Admin.home);	

	router.route('/admin/addbook')
		.get(Admin.addbook)
		.post(Admin.addbookFxn);

	router.route('/admin/approveborrowers')
		.get(Admin.approve)
		.post(Admin.manageUser);

	router.route('/admin/allborrowers')
		.get(Admin.allborrowers);

	router.route('/admin/allbooks')
		.get(Admin.allbooks);
			
	router.route('/admin/borrowedbooks')
		.get(Admin.borrowedbooks);	
	
	router.route('/admin/duebooks')
		.get(Admin.duebooks);
		
	router.route('/admin/getAllBorrowers')
		.get(Admin.getBorrowers);
		
	router.route('/admin/pendingBorrowers')
		.get(Admin.pending);
		
	router.route('/admin/getBorrowedBook')
		.get(Admin.getBorrowedBook);
	
	router.route('/admin/getDueBook')
		.get(Admin.getDueBook);

	return router;
};
