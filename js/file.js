function File(id){
	let _this = this;
	if(!id) id = File.uuid();
	let info = this.info = {id, enabled:true};
	
	this.changeInfo = function(i){
		for(let _i in i){
			info[_i] = i[_i];
		}
	};
	
	this.save = function(){
		return new Promise(function(succ, err){
			Storage.save({[File.PREFIX+info.id]:info}).then(_ => {
				File.saveIndex(info.id, info.enabled).then(succ);
			});
		});
	};
	
	this.onChange = function(info){}; //Placeholder function
	Storage.onChange(File.PREFIX+id, newInfo => {
		_this.onChange(info = _this.info = newInfo);
	});
}
File.PREFIX = "FILE-";
File.saveIndex = function(id, enabled){
	return new Promise((succ, err) => {
		File.loadIndex().then((index) => {
			index[id] = enabled;
			Storage.save({"INDEX":index}).then(succ);
		});
	});
};
File.loadIndex = function(){
	return new Promise((succ, err) => {
		Storage.load(["INDEX"]).then((result) => {
			let index = result["INDEX"] || {};
			succ(index);
		});
	});
};
File.uuid = function(){
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => 
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
};
File.remove = function(id){
	return new Promise((succ, err) => {
		File.loadIndex().then((index) => {
			delete index[id];
			Storage.save({"INDEX":index}).then(_ => {
				Storage.remove([File.PREFIX+id]).then(succ);
			});
		});
	});
};
File.load = function(id){
	return new Promise((succ, err) => {
		let innerID = File.PREFIX+id;
		Storage.load([innerID]).then(result => {
			if(!result[innerID]) err();
			let file = new File(id);
			file.changeInfo(result[innerID]);
			succ(file);
		});
	});
};
File.loadAll = function(){
	return new Promise((succ, err) => {
		let files = [];
		File.loadIndex().then((index) => {
			for(let id in index){
				files.push(File.load(id));
			}
			Promise.all(files).then((files) => {
				succ(files);
			});
		});
	});
};
File.loadEnabled = function(){
	return new Promise((succ, err) => {
		let files = [];
		File.loadIndex().then((index) => {
			for(let id in index){
				if(index[id]) files.push(File.load(id));
			}
			Promise.all(files).then((files) => {
				succ(files);
			})
		});
	});
};
