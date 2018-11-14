var fileId = window.location.hash.substr(1);
var file = {};

var nameInput = document.getElementById("name-input");
var saveBtn = document.getElementById("save-btn");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

File.load(fileId).then(f => {
	let info = (file = f).info;
	nameInput.value = info.name;
	editor.setValue(info.content||"");
});

function save() {
	let info = file.info;
	info.name = nameInput.value;
	info.content = editor.getValue();
	file.save();
}
saveBtn.addEventListener("click", save);
window.addEventListener("keydown", function(e){
	if(e.ctrlKey && e.key=="s"){
		e.preventDefault();
		e.stopPropagation();
		save();
	}
}, true);
