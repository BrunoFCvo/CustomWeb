let Storage = {};
Storage.save = function(object){
	return new Promise(function(succ, err){
		chrome.storage.sync.set(object, succ);
	});
}
Storage.load = function(objects){
	return new Promise(function(succ, err){
		chrome.storage.sync.get(objects, succ);
	});
}
Storage.remove = function(objects){
	return new Promise(function(succ, err){
		chrome.storage.sync.remove(objects, succ);
	});
}
Storage.callbacks = {};
Storage.onChange = function(key, fn){
	if(!Storage.callbacks[key]) Storage.callbacks[key] = [];
	Storage.callbacks[key].push(fn);
}
Storage.emit = function(key, newValue){
	if(!Storage.callbacks[key]) return;
	Storage.callbacks[key].forEach(x => {
		x(newValue);
	});
}
chrome.storage.onChanged.addListener(function(objects, area){
	if(area!="sync") return;
	for(let id in objects){
		Storage.emit(id, objects[id].newValue);
	}
});