(function init(){
	$.get("../templates/borrowerList.html", function(data){
		$.template("bRow", data);
		$.getJSON("http://localhost:3000/admin/borrowersList", function(bList){
			for(var i = 0; i < bList.length ; i++){
				$.tmpl("bRow", bList[i]).appendTo("#bTable");
			}
		})
	});
})();
