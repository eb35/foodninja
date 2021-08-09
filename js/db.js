// realtime listener
db.collection("recipes").onSnapshot(snapshot => {
	snapshot.docChanges().forEach(change => {
		console.log("change", change.doc.data(), change.doc.id);
		if (change.type === "added") {
			// add doc to page
		}
		if (change.type === "removed") {
			// remove doc from page
		}
		if (change.type === "changed") {
			// what about changes
		}
	});
});