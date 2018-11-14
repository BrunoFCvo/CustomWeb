function File(options){
	let o = options || {};
	let file = document.createElement("div");
	file.className = "file";
	file.innerHTML = `
		<label><input type="checkbox" class="file-enable" ${o.enabled?"checked='true'":""}><span></span></label>
		<span class="file-name">${o.name}</span>
		<span class="file-type">${o.type}</span>
		<div class="file-icons">
			<span class="file-icon file-edit">
				<svg viewBox="0 0 48 48">
					<path d="M6 34.5v7.5h7.5l22.13-22.13-7.5-7.5-22.13 22.13zm35.41-20.41c.78-.78.78-2.05 0-2.83l-4.67-4.67c-.78-.78-2.05-.78-2.83 0l-3.66 3.66 7.5 7.5 3.66-3.66z"/>
				</svg>
			</span>
			<span class="file-icon file-delete">
				<svg viewBox="0 0 48 48">
					<path d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z"/>
				</svg>
			</span>
		</div>
	`;
	
	let fileEdit = file.querySelector(".file-icon.file-edit");
	fileEdit.addEventListener("click", function(){
		chrome.tabs.create({url: chrome.runtime.getURL("editor.html#file-"+o.id)});
	});
	let fileDelete = file.querySelector(".file-icon.file-delete");
	fileDelete.addEventListener("click", function(){
		if(fileDelete.classList.contains("icon-confirm")){
			file.remove();
		}else{
			fileDelete.classList.add("icon-confirm");
			setTimeout(function(){
				fileDelete.classList.remove("icon-confirm");
			}, 1000);
		}
	});
	
	this.appendTo = function(element){
		element.appendChild(file);
	}
}

let files = document.getElementById("files");
for(let i=0;i<10;i++){
	new File({
		enabled: i%2,
		name: "Nice "+(i+1),
		type: i%4?"CSS":"JS"
	}).appendTo(files);
}

let newFile = document.getElementById("new-file");
newFile.addEventListener("click", function(){
	new File({
		enabled: true,
		name: "New File",
		type: "JS"
	}).appendTo(files);
});