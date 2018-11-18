let active = document.getElementById("active");
let manage = document.getElementById("manage");
manage.addEventListener("click", e => {
	chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});
chrome.tabs.query({active: true, currentWindow: true}, tabs => {
	chrome.tabs.sendMessage(tabs[0].id, {action: "list"}, list => {
		if(!list) return;
		list.forEach(info => {
			console.log(info);
			let file = new File(info.id);
			file.changeInfo(info);
			info = file.info;
			
			let span = document.createElement("span");
			span.className = "line btn";
			span.addEventListener("click", e => {
				if(e.target.classList.contains("btn"))
				chrome.tabs.create({ url: chrome.runtime.getURL("editor.html#"+info.id)});
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
				console.log(file, info);
				file.save();
			});
			span.appendChild(enable);
			
			let name = document.createElement("span");
			name.textContent = info.name;
			span.appendChild(name);
			
			let type = document.createElement("span");
			type.textContent = info.type;
			span.appendChild(type);
			
			active.appendChild(span);
		});
	});
});