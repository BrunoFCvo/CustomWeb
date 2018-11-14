function File(id){
	let _this = this;
	if(!id) id = File.uuid();
	let info = this.info = {id, enabled:true};
	
	this.changeInfo = function(i){
		for(let _i in i){
			info[_i] = i[_i];
		}
	}
	
	this.save = function(){
		return new Promise(function(succ, err){
			Storage.save({[File.SUFFIX+info.id]:info}).then(_ => {
				File.saveIndex(info.id, info.enabled).then(succ);
			});
		});
	}
	
	this.appendTo = function(element){
		let i = info;
		let file = document.createElement("div");
		file.className = "file";
		file.innerHTML = `
			<label class="check"><input type="checkbox" ${i.enabled?"checked='true'":""}><span></span></label>
			<span class="file-name">${i.name}</span>
			<span class="file-type">${i.type}</span>
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
		
		let fileEnable = file.querySelector("input");
		fileEnable.addEventListener("change", function(){
			info.enabled = this.checked;
			_this.save();
		});
		let fileEdit = file.querySelector(".file-icon.file-edit");
		fileEdit.addEventListener("click", function(){
			chrome.tabs.create({url: chrome.runtime.getURL("editor.html#"+i.id)});
		});
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
		element.appendChild(file);
	}
	
}
File.SUFFIX = "FILE-";
File.saveIndex = function(id, enabled){
	return new Promise((succ, err) => {
		File.loadIndex().then((index) => {
			index[id] = enabled;
			Storage.save({"INDEX":index}).then(succ);
		});
	});
}
File.loadIndex = function(){
	return new Promise((succ, err) => {
		Storage.load(["INDEX"]).then((result) => {
			let index = result["INDEX"] || {};
			succ(index);
		});
	});
}
File.uuid = function(){
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => 
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}
File.remove = function(id){
	return new Promise((succ, err) => {
		File.loadIndex().then((index) => {
			delete index[id];
			Storage.save({"INDEX":index}).then(_ => {
				Storage.remove([File.SUFFIX+id]).then(succ);
			});
		});
	});
}
File.load = function(id){
	return new Promise((succ, err) => {
		let innerID = File.SUFFIX+id;
		Storage.load([innerID]).then(result => {
			if(!result[innerID]) err();
			let file = new File(id);
			file.changeInfo(result[innerID]);
			succ(file);
		});
	});
}
File.loadAll = function(){
	return new Promise((succ, err) => {
		let files = [];
		File.loadIndex().then((index) => {
			console.log(index);
			for(let id in index){
				files.push(File.load(id));
			}
			Promise.all(files).then((files) => {
				console.log(files);
				succ(files);
			});
		});
	});
}
File.loadEnabled = function(){
	return new Promise((succ, err) => {
		let files = [];
		File.loadIndex().then((index) => {
			for(let id in index){
				if(index[id]) files.push(File.load(File.SUFFIX+id));
			}
			Promise.all(files).then((files) => {
				succ(files);
			})
		});
	});
}