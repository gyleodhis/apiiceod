var mongoose = require("mongoose")
	jsonSelect = require('mongoose-json-select'),
	helpers = require("../lib/helpers"),
	_ = require("underscore")



module.exports = function(db) {
	var schema = require("../schemas/provider.js")
	var modelDef = db.getModelFromSchema(schema)

	modelDef.schema.plugin(jsonSelect, '-frenchbeans')
	modelDef.schema.methods.toHAL = function() {
		var halObj = helpers.makeHAL(this.toJSON(),
									[{name: 'frenchbeans', 'href': '/providers/' + this.id + '/frenchbeans', 'title': 'Frenchbeans'}])

		if(this.frenchbeans.length > 0) {
			if(this.frenchbeans[0].toString().length != 24) {
				halObj.addEmbed('frenchbeans', _.map(this.frenchbeans, function(e) { return e.toHAL() }))

			}
		}

		return halObj
	}
	

	return mongoose.model(modelDef.name, modelDef.schema)
}