(function init(){
	$.get("../templates/borrower.html", function(data){
		$.template("bRow", data);
		$.getJSON("http://localhost:3000/admin/pendingBorrowers", function(bList){
			for(var i = 0; i < bList.length ; i++){
				$.tmpl("bRow", bList[i]).appendTo("#btable");
			}
		})
	});
})();
