File.loadEnabled().then(files => {
	for(let i=0;i<files.length;i++){
		//TODO check if url matches
		window.eval(files[i].info.content);
	}
});
