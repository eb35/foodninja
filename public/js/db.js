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
			removerecipe(change.doc.id);
		}
		if (change.type === "changed") {
			// what about changes
		}
	});
});

// add new recipe
const form = document.querySelector("form");
form.addEventListener("submit", event => {
	event.preventDefault();
	const recipe = {
		title: form.title.value,
		ingredients: form.ingredients.value
	};
	
	db.collection("recipes").add(recipe)
		.catch(error => console.log("ERROR:", error));
	
	form.title.value = "";
	form.ingredients.value = "";
});

// delete recipe
const recipeswrapper = document.querySelector(".recipes");
recipeswrapper.addEventListener("click", event => {
	if (event.target.tagName === "I") {
		const id = event.target.getAttribute("data-id");
		db.collection("recipes").doc(id).delete();
	}
})