var fileId = window.location.hash.substr(1);
var file = {};

var nameInput = document.getElementById("name-input");
var saveBtn = document.getElementById("save-btn");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

chrome.storage.sync.get([fileId], (result) => {
    var info = result[fileId];
    
    if(!info || !info.id) {
        alert("File not found");
        info = {
            id: fileId,
            name: "New File",
            content: ""
        }
    }

    file = info;
    nameInput.value = file.name;
    editor.setValue(file.content);
});

function save() {
    file.name = nameInput.value;
    file.content = editor.getValue();

    keyval = {};
    keyval[fileId] = file;
    chrome.storage.sync.set(keyval, function() {
        alert("Saved");
    });
}
saveBtn.addEventListener("click", save);
window.addEventListener("keydown", function(e){
	if(e.ctrlKey && e.key=="s"){
		e.preventDefault();
		e.stopPropagation();
		save();
	}
}, true);
