var books = [];
function init(){
	$.get("../templates/borrowBook.html", function(data){
			$.template("booktmpl", data);
			$.getJSON('http://localhost:3000/getAllBorrowedBooks', function(brrwd){
			$.getJSON('../scripts/data.json', function(bList){
				for(var i = 0; i < bList.length ; i++){
					var check = true;
					for(var j = 0; j < brrwd.length; j++){
						if(bList[i].bookid == brrwd[j].bookid) check = false;
					}
					if(check) books.push(bList[i]);
				}
				paginate();
				for(var i = 0; i <  3; i++){
					if(books[i].bookname=="") break;
					$.tmpl("booktmpl", books[i]).appendTo("#booksDiv");
				}	
			});
		});
	});
}

function paginate(){
	var limit = Math.ceil((books.length)/3);
	for(var i = 1; i <= limit; i++){
		$("#buttonsDiv").append($('<input type="button" onclick="setPage(this, this.value)" class="btn btn-danger" >').val(i));
	}
}

function setPage(btn, page){
	$("#booksDiv").empty();
	$.get("../templates/borrowBook.html", function(data){
		$.template("markup", data);
		var start = (page-1)*3;
		for(var i = start; i < start + 3; i++){
			if(books[i].bookname="") break;
			$.tmpl("markup", books[i]).appendTo("#booksDiv");
		}
	});	
}
