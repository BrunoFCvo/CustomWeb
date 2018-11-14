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