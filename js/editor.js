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
		createLinkEntry();
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

/* export */
let downloadLink = document.createElement("a");
downloadLink.style.display = "none";
document.body.appendChild(downloadLink);

let downloadBtn = document.getElementById("download-btn");
downloadBtn.addEventListener("click", () => {
	save();
	let info = file.info;
	delete info.id;
	downloadLink.href = "data:text/json;charset=utf-8," + 
		encodeURIComponent(JSON.stringify(info));
	downloadLink.download = info.name + ".json";
	downloadLink.click();
});


/* links */
let popupActive = false;
let popup = document.getElementById("links-popup");
let linksWrapper = document.getElementById("links-wrapper");

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
document.getElementById("close-links-btn").
	addEventListener("click", linksClose);
document.addEventListener("mousedown", linksClose);
window.addEventListener("keydown", (e) => {
	if(e.key === "Escape") { linksClose(); }
});

popup.addEventListener("mousedown", (e) => {
	e.stopPropagation();
});

function createLinkEntry(link = "") {
	let empty = link == "";

	let entry = document.createElement("div");
	entry.className = "link-entry";
	entry.innerHTML = `
		<input type="text" value="${link}" placeholder="Add a target website"/>
		<svg viewBox="0 0 24 24" title="Delete entry">
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
		</svg>
	`;

	let entryInput = entry.querySelector("input");
	entryInput.addEventListener("input", () => {
		if(empty) {
			entrySvg.style.display = "";
			empty = false;
			createLinkEntry();
		}
		editorSetEdited();
	});
	entryInput.addEventListener("blur", () => {
		if(entryInput.value == "" && !empty) {
			entry.remove();
		}
	});

	let entrySvg = entry.querySelector("svg");
	if(empty) { entrySvg.style.display = "none"; }
	entrySvg.addEventListener("click", () => {
		if(!empty) {
			entry.remove();
			editorSetEdited();
		}
	});

	linksWrapper.appendChild(entry);
}

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
			if(input.value != "") { 
				links.push(input.value); 
			}
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
