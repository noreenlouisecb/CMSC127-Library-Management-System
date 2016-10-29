var user;
var brrwdBooks = [];
var allbooks = [];
function init(){
	$.getJSON('../scripts/data.json', function(bList){
		for(var i = 0; i < bList.length ; i++	) allbooks.push(bList[i]);
		$.get("../templates/returnBook.html", function(data){
		$.template("booktmp", data);
			$.getJSON("http://localhost:3000/getAllBorrowedBooks", function(books){
				for(var i = 0; i < books.length; i++){
					for(var j = 0; j < allbooks.length ; j++){
						console.log(books[i]);
						if(books[i].bookid == allbooks[j].bookid){
							books[i].bookname = allbooks[j].bookname;
							books[i].nobkcopy = allbooks[j].nobkcopy;
							break;
						}	
					}
					brrwdBooks.push(books[i]);
				}
				for(var i = 0; i < brrwdBooks.length; i++){	
					$.tmpl("booktmp", brrwdBooks[i]).appendTo('#tableBody');
				}
			});
		});
	});
}

