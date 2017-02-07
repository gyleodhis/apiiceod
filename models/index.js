

module.exports = function(db) {
	return {
		"Frenchbeans": require("./frenchbeans")(db),
		"Iron_in_aiv": require("./iron_in_aiv"),
		//"Booksale": require("./booksale")(db),
		"ClientReview": require("./clientreview")(db),
		//"Client": require("./client")(db),
		//"Employee": require("./employee")(db),
		//"Store": require("./store")(db),
		"Author": require("./provider")(db)
	}
}