// offline data
db.enablePersistence()
	.catch(error => {
		if (error.code == "failed-precondition") {
			// probably multiple tabs
			console.log("persistence failed");
		} else if(error.code == "unimplemented") {
			// browser doesn't support
			console.log("persistence is not available");
		}
	});

// realtime listener
db.collection("recipes").onSnapshot(snapshot => {
	snapshot.docChanges().forEach(change => {
		if (change.type === "added") {
			// add doc to page
			renderrecipe(change.doc.data(), change.doc.id);
		}
		if (change.type === "removed") {
			// remove doc from page
		}
		if (change.type === "changed") {
			// what about changes
		}
	});
});