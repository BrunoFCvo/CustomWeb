let fileId = window.location.hash.substr(1);
let file = {};

let enableInput = document.getElementById("enable-input");
let nameInput = document.getElementById("name-input");
let saveBtn = document.getElementById("save-btn");
let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

File.load(fileId).then(f => {
    let info = (file = f).info;
	enableInput.parentNode.classList.add("no-transition");
    enableInput.checked = info.enabled;
	setTimeout(function(){enableInput.parentNode.classList.remove("no-transition")}, 0)
	nameInput.value = info.name;
    editor.setValue(info.content||"", -1);
	
	f.onChange = function(info){
		enableInput.checked = info.enabled;
		nameInput.value = info.name;
		editor.setValue(info.content||"", -1);
		saveBtn.classList.remove("edited");
	}
    
    enableInput.addEventListener("input", editorSetEdited);
    nameInput.addEventListener("input", editorSetEdited);
    editor.session.on("change", editorSetEdited);
});

function editorSetEdited() {
    saveBtn.classList.add("edited");
}

function save() {
    let info = file.info;
    info.enabled = enableInput.checked;
	info.name = nameInput.value;
	info.content = editor.getValue();
    file.save();
    
    saveBtn.classList.remove("edited");
}
saveBtn.addEventListener("click", save);
window.addEventListener("keydown", function(e){
	if(e.ctrlKey && e.key=="s"){
		e.preventDefault();
		e.stopPropagation();
		save();
	}
}, true);
