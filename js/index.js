function createFileEntry(fileObject, element){
	let info = fileObject.info;
	let file = document.createElement("div");
	file.className = "file";
	file.innerHTML = `
		<label class="check" title="Enable or disable file"><input type="checkbox" ${info.enabled?"checked='true'":""}><span></span></label>
		<span class="file-name">${info.name}</span>
		<span class="file-type">${info.type}</span>
		<div class="file-icons">
			<span class="file-icon file-edit" title="Edit file">
				<svg viewBox="0 0 48 48">
					<path d="M6 34.5v7.5h7.5l22.13-22.13-7.5-7.5-22.13 22.13zm35.41-20.41c.78-.78.78-2.05 0-2.83l-4.67-4.67c-.78-.78-2.05-.78-2.83 0l-3.66 3.66 7.5 7.5 3.66-3.66z"/>
				</svg>
			</span>
			<span class="file-icon file-delete" title="Delete file">
				<svg viewBox="0 0 48 48">
					<path d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z"/>
				</svg>
			</span>
		</div>
	`;
	
	let fileName = file.querySelector(".file-name");
	let fileType = file.querySelector(".file-type");
	let fileEnable = file.querySelector("input");
	fileEnable.addEventListener("change", function(){
		info.enabled = this.checked;
		fileObject.save();
	});
	let fileEdit = file.querySelector(".file-icon.file-edit");
	fileEdit.addEventListener("click", edit);
	let fileDelete = file.querySelector(".file-icon.file-delete");
	fileDelete.addEventListener("click", function(){
		if(fileDelete.classList.contains("icon-confirm")){
			File.remove(info.id).then(function(){
				file.remove();
			});
		}else{
			fileDelete.classList.add("icon-confirm");
			setTimeout(function(){
				fileDelete.classList.remove("icon-confirm");
			}, 1000);
		}
	});
	file.addEventListener("click", e => {
		if(e.target.className=="file") edit();
	});
	element.appendChild(file);
	
	fileObject.onChange = function(info){
		fileEnable.checked = info.enabled;
		fileName.textContent = info.name;
	}
	
	function edit(){
		chrome.tabs.create({url: chrome.runtime.getURL("editor.html#"+info.id)});
	}
}

let filesElement = document.getElementById("files");
File.loadAll().then(function(files){
	for(let i=0;i<files.length;i++){
		createFileEntry(files[i], filesElement);
	}
});

let newFileJS = document.getElementById("new-js");
newFileJS.addEventListener("click", () => {
	let f = new File();
	f.changeInfo({type: "JS", name: "New Script"});
	f.save().then(() => {
		createFileEntry(f, filesElement);
	});
});

let newFileCSS = document.getElementById("new-css");
newFileCSS.addEventListener("click", () => {
	let f = new File();
	f.changeInfo({type: "CSS", name: "New Stylesheet"});
	f.save().then(() => {
		createFileEntry(f, filesElement);
	});
});

/* file input */
function newFromFile(inFile) {
	let info = {};
	
	if(inFile.type == "text/javascript") {
		info.type = "JS";
		info.name = inFile.name.match(/(.*)\..*$/);
	} else if(inFile.type == "text/css") {
		info.type = "CSS";
		info.name = inFile.name.match(/(.*)\..*$/);
	} else if(inFile.type == "application/json") {
	} else {
		alert("Unsupported file type");
		return;
	}

	let reader = new FileReader();
	reader.addEventListener("load", () => {
		if(inFile.type == "application/json") {
			try {
				info = JSON.parse(reader.result);
			} catch(e) { alert("The uploaded json file is not valid"); }
		} else {
			info.content = reader.result;
		}

		let f = new File();
		f.changeInfo(info);
		f.save().then(() => {
			createFileEntry(f, filesElement);
		});
	});
	reader.readAsText(inFile);
}

document.body.addEventListener("dragover", (e) => {
	e.preventDefault();
	e.stopPropagation();
	document.body.classList.add("drag-over");
});
document.body.addEventListener("dragleave", (e) => {
	e.preventDefault();
	e.stopPropagation();
	document.body.classList.remove("drag-over");
});
document.body.addEventListener("drop", (e) => {
	e.preventDefault();
	e.stopPropagation();
	document.body.classList.remove("drag-over");
	newFromFile(e.dataTransfer.files[0]);
});

let inputFile = document.createElement("input");
inputFile.type = "file";
inputFile.addEventListener("change", () => {
	newFromFile(inputFile.files[0]);
});

let newFileUp = document.getElementById("new-up");
newFileUp.addEventListener("click", () => { inputFile.click(); });
