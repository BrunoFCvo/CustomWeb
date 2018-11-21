let tabs = {};
function createTab(id){
	tabs[id] = {
		badge: 0,
		top: "",
		frames: []
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
			case "add-badge": {
				tab.badge += value;
				if(tab.badge>0)
					chrome.browserAction.setBadgeText({
						tabId: tabID,
						text: String(tab.badge)
					});
				break;
			}
			case "add-files": {
				tab.frames.push(value);
				break;
			}
			case "set-url": {
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
				sendResponse(tab.frames);
				break;
			}
			case "get-url": {
				sendResponse(tab.top);
				break;
			}
		}
	}
});
chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
	if(changeInfo.status=="loading")
		createTab(tabID);
});
chrome.tabs.onRemoved.addListener((tabID, removeInfo) => {
	delete tabs[tabID];
});