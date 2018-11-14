let filesElement = document.getElementById("files");
File.loadAll().then(function(files){
	for(let i=0;i<files.length;i++){
		files[i].appendTo(filesElement);
	}
});

let newFile = document.getElementById("new-file");
newFile.addEventListener("click", function(){
	let f = new File();
	f.changeInfo({
		name: "New File",
		type: "JS"
	});
	f.save().then(function(){
		f.appendTo(filesElement);
	});
});