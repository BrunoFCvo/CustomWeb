let promise = new Promise((succ, err) => {
	let interval = setInterval(_ => {
		if(document.head){
			clearInterval(interval);
			succ();
		}
	});
});
File.loadEnabled().then(files => {
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

		if(info.type == "JS") {
			window.eval(info.content);
		} else {
			promise.then(_ => {
				let cssContainer = document.createElement("style");
				cssContainer.textContent = info.content;
				document.head.appendChild(cssContainer);
			})
		}
	}
});
