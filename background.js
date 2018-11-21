let tabs = {};
function createTab(id){
	tabs[id] = {
		top: "",
		scriptsIndex: {},
		scripts: []
	};
}

chrome.browserAction.setBadgeBackgroundColor({color:"#303030"});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	let rTabID = request.tabID;
	let action = request.action;
	let value = request.value;
	
	if(sender.tab){ // Messages from tabs
		let tabID = sender.tab.id;
		if(!tabs[tabID]) createTab(tabID)
		let tab = tabs[tabID];
	
		switch(action){
			case "add-files": {
				value.forEach(info => {
					if(!tab.scriptsIndex[info.id]){
						tab.scriptsIndex[info.id] = info;
						tab.scripts.push(info);
						if(info.enabled) tab.badge++;
					}
				});
				
				if(tab.scripts.length>0)
					chrome.browserAction.setBadgeText({
						tabId: tabID,
						text: String(tab.scripts.length)
					});
				break;
			}
			case "set-url": {
				createTab(tabID);
				tab.top = value;
				break;
			}
		}
	} else { // Messages from anywhere else
		let tab;
		if(rTabID){
			tab = tabs[rTabID];
			if(!tab) return;
		}
		
		switch(action){
			case "get-files": {
				sendResponse(tab.scripts);
				break;
			}
			case "get-url": {
				sendResponse(tab.top);
				break;
			}
		}
	}
});
chrome.tabs.onRemoved.addListener((tabID, removeInfo) => {
	delete tabs[tabID];
});