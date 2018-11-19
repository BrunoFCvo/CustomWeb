chrome.browserAction.setBadgeBackgroundColor({color:"#303030"});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if(request.action=="badge" && request.value)
		chrome.browserAction.setBadgeText({
			tabId:sender.tab.id,
			text:request.value+""
		});
});