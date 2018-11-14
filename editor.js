var fileId = "script-0";      //TODO not to be hardcoded
var fileInfo = null;

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

    fileInfo = info;
    nameInput.value = fileInfo.name;
    editor.setValue(fileInfo.content);
});

function save() {
    fileInfo.name = nameInput.value;
    fileInfo.content = editor.getValue();

    keyval = {};
    keyval[fileId] = fileInfo;
    chrome.storage.sync.set(keyval, function() {
        alert("Saved");
    });
}

editor.commands.addCommand({
    name: "save",
    bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
    exec: save
})

saveBtn.addEventListener("click", save);
