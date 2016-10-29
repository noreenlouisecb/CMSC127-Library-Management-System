function init(){
	$.get("../templates/book.html", function(data){
		$.template("booktmp", data);
		$.getJSON('http://localhost:3000/allBooks', function(bList){
			for(var i = 0; i < bList.length; i++) 
				$.tmpl("booktmp", bList[i]).appendTo('#tBody');
		});
	});
}
