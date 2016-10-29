function init(){
	$.getJSON("http://localhost:3000/borrower/loggedIn", function(borrower){
		$('#intro').text("Welcome " + borrower.blname + ", " + borrower.bfname);
	});
	alert("hi");
	$('#dataTables-example').dataTable();
	$("#bookstable").empty();

	var t = $('#dataTables-example').DataTable();
	var books = [];
	$.getJSON("http://localhost:3000/borrower/getDuebooks", function(dueBooks) {
		$.getJSON("../scripts/data.json", function(allbooks){
			for(var i = 0; i < dueBooks.length; i++){
				for(var j = 0 ; j < allbooks.length; j++){
					if(dueBooks[i].bookid == allbooks[j].bookid){
						dueBooks[i].bookname = allbooks[j].bookname;
					}
				}
				books.push(dueBooks[i]);
			}
			books.forEach(function(book){
				$.get("../scripts/duebookstemplate.html", function(data){
					var x = $.tmpl(data, book);
					t.row.add(x).draw(false);
				});
			});
		}):
	});
}



