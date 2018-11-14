var fileId = "script-0";      //TODO not to be hardcoded

chrome.storage.sync.get([fileId], (result) => {
    var info = result[fileId];
    if(info) {
        window.eval(info.content);
    }
});
