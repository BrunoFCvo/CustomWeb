let fileId = window.location.hash.substr(1);
let file = {};

let enableInput = document.getElementById("enable-input");
let nameInput = document.getElementById("name-input");
let linksBtn = document.getElementById("links-btn");
let saveBtn = document.getElementById("save-btn");
let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");

File.load(fileId).then((f) => {
    let info = (file = f).info;
	enableInput.parentNode.classList.add("no-transition");
    enableInput.checked = info.enabled;
	setTimeout(()=>{enableInput.parentNode.classList.remove("no-transition")}, 0);
	nameInput.value = info.name;
    editor.setValue(info.content||"", -1);
	
	if(info.type == "JS") {
		editor.session.setMode("ace/mode/javascript");
	} else {
		editor.session.setMode("ace/mode/css");
	}

	if(info.links) {
		info.links.forEach((link) => {
			createLinkEntry(link);
		});
	}

	f.onChange = function(info){
		enableInput.checked = info.enabled;
		nameInput.value = info.name;
	}
    
    enableInput.addEventListener("input", editorSetEdited);
	nameInput.addEventListener("input", editorSetEdited);
    editor.session.on("change", editorSetEdited);
});

function editorSetEdited() {
    saveBtn.classList.add("edited");
}

/* links */
let popupActive = false;
let popup = document.getElementById("links-popup");
let linksWrapper = document.getElementById("links-wrapper");
let addLinkBtn = document.getElementById("add-link-btn");

linksBtn.addEventListener("click", (e) => {
	e.stopPropagation();

	if(popupActive) {
		popup.style.display = "none";
		popupActive = false;
	} else {
		popup.style.display = "flex";
		popupActive = true;
	}
});

function linksClose() {
	if(popupActive) {
		popup.style.display = "none";
		popupActive = false;
		save();
	}
}
document.addEventListener("mousedown", linksClose);
window.addEventListener("keydown", (e) => {
	if(e.key === "Escape") { linksClose(); }
});

popup.addEventListener("mousedown", (e) => {
	e.stopPropagation();
});

function createLinkEntry(link = "") {
	let entry = document.createElement("div");
	entry.className = "link-entry";
	entry.innerHTML = `
		<input type="text" value="${link}" placeholder="https://www.example.com/*"/>
		<svg viewBox="0 0 24 24">
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
		</svg>
	`;

	entry.querySelector("input")
		.addEventListener("input", editorSetEdited);

	entry.querySelector("svg")
		.addEventListener("click", () => {
			entry.remove();
			editorSetEdited();
		});

	linksWrapper.appendChild(entry);
}
addLinkBtn.addEventListener("click", () => { 
	createLinkEntry();
	editorSetEdited();
});

/* save */
enableInput.addEventListener("change", save);

function save() {
    let info = file.info;
    info.enabled = enableInput.checked;
	info.name = nameInput.value;
	info.content = editor.getValue();

	let links = [];
	let inputs = linksWrapper.querySelectorAll("input");
	if(inputs) {
		inputs.forEach((input) => {
			links.push(input.value);
		});
	}
	info.links = links;
	
    file.save();
    
    saveBtn.classList.remove("edited");
}
saveBtn.addEventListener("click", save);
window.addEventListener("keydown", (e) => {
	if(e.ctrlKey && e.key=="s") {
		e.preventDefault();
		e.stopPropagation();
		save();
	}
}, true);
