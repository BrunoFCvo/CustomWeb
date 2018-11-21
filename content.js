let myHead = document.createElement("custom-web");
document.documentElement.appendChild(myHead);

File.loadAll().then(files => {
	let activeFiles = [];
	let enabled = 0;
	for(let i = 0; i < files.length; i++){
		let info = files[i].info;
		
		if(info.links && info.links.length > 0) {
			let found = false;
			for(let l = 0; l < info.links.length && !found; l++) {
				let regexp = new RegExp(info.links[l]);
				found = window.location.href.match(regexp);
			}
			if(!found) continue;
		}
		activeFiles.push(info);
		if(!info.enabled) continue;
		enabled++;
		if(info.type == "JS") {
			let jsContainer = document.createElement("script");
			jsContainer.textContent = info.content;
			myHead.appendChild(jsContainer);
		} else {
			let cssContainer = document.createElement("style");
			cssContainer.textContent = info.content;
			myHead.appendChild(cssContainer);
		}
	}
	let isTop = (window == window.top);
	
	if(isTop){ // Only allow top to set URL
		chrome.runtime.sendMessage({
			action: "set-url",
			value: window.location.href
		});
	}
	chrome.runtime.sendMessage({
		action: "add-files",
		value: activeFiles
	});
});
