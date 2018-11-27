let addNew = document.getElementById("add-new");
let section = document.getElementById("files");
let manage = document.getElementById("manage");
manage.addEventListener("click", e => {
	chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
	window.close();
});
chrome.tabs.query({active: true, currentWindow: true}, tabs => {
	let tabID = tabs[0].id;
	
	// Query file list
	chrome.runtime.sendMessage({tabID, action: "get-files"}, files => {
		if(!files || !files.length) return;
		files.forEach(info => {
			let file = new File(info.id);
			file.changeInfo(info);
			info = file.info;
			
			let span = document.createElement("span");
			span.className = "line btn";
			span.addEventListener("click", e => {
				if(e.target.classList.contains("btn")){
					chrome.tabs.create({ url: chrome.runtime.getURL("editor.html#"+info.id)});
					window.close();
				}
			});
			
			let enable = document.createElement("label");
			enable.className = "check small";
			enable.innerHTML = `
				<input id="enable-input" type="checkbox">
				<span><span></span></span>
			`;
			let input = enable.children[0];
			input.checked = info.enabled;
			input.addEventListener("change", e => {
				file.info.enabled = input.checked;
				file.save();
			});
			span.appendChild(enable);
			
			let name = document.createElement("span");
			name.className = "line-item";
			name.textContent = info.name;
			span.appendChild(name);
			
			let type = document.createElement("span");
			type.className = "line-item";
			type.textContent = info.type;
			span.appendChild(type);

			file.onChange = function(info){
				input.checked = info.enabled;
				name.textContent = info.name;
			}
			
			section.appendChild(span);
		});
	});
	
	// Query URL
	chrome.runtime.sendMessage({tabID, action: "get-url"}, url => {
		if(!url){
			addNew.style.display = "none";
			return;
		}
		
		let addJS = document.getElementById("add-js");
		let addCSS = document.getElementById("add-css");
		addJS.addEventListener("click", e =>{add("JS")});
		addCSS.addEventListener("click", e =>{add("CSS")});

		function add(type){
			let f = new File();
			f.changeInfo({type, name: "New "+(type=="CSS"?"Stylesheet":"Script"), links:[url]});
			f.save().then(_ => {
				chrome.tabs.create({ url: chrome.runtime.getURL("editor.html#"+f.info.id)});
				window.close();
			});
		}
	});
});