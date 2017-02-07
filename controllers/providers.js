var BaseController = require("./basecontroller"),
  swagger = require("swagger-node-restify")



function Frenchbeans() {

}

Frenchbeans.prototype = new BaseController()

module.exports = function(lib) {
  var controller = new Frenchbeans() // Tthi si a very important part. Replaced BookSales with Frenchbeans.

  //list
  controller.addAction({
  	'path': '/providers',
  	'method': 'GET',
  	'summary' :'Returns the list of providers for the datasets',
  	'params': [ swagger.queryParam('genre', 'Filter providers by the their dataset', 'string'),
  				swagger.queryParam('q', 'Search parameter', 'string')],
  	'responseClass': 'Provider', // Replaced Author with Provider.
  	'nickname': 'getProviders'
  }, function(req, res, next) {
    console.log(req)
	var criteria = {}
    if(req.params.q) {
      var expr = new RegExp('.*' + req.params.q + '.*', 'i')
      criteria.$or = [
        {name: expr},
        {description: expr}
      ]
    }
    var filterByGenre = false || req.params.genre

    if(filterByGenre) {
    	console.log("Filtering by genre: " + filterByGenre)
    	lib.db.model('dataset')
    		.find({genre: filterByGenre})
    		.exec(function(err, Frenchbeans) {
    			if(err) return next(controller.RESTError('InternalServerError', err))
    			findAuthors(_.pluck(books, '_id'))
    		})
    } else {
    	findAuthors()
    }

    // In the following line I replaced bookIds with datasetIds.
    function findAuthors(datasetIds) {
    	if(datasetIds) {
    		criteria.frenchbeans = {$in: datasetIds}

    	}
		lib.db.model('Provider')
	  		.find(criteria)
	  		.exec(function(err, providers) {
	  			if(err) return next(controller.RESTError('InternalServerError', err))
	  			controller.writeHAL(res, providers)
	  		})
    }
  	
  })
  //get
  controller.addAction({
  	'path': '/providers/{id}',
  	'summary': 'Returns all the dataset from one specific provider',
  	'method': 'GET',
  	'responseClass': 'Provide',
  	'nickname': 'getProviders'
  }, function (req, res, next) {
  	var id = req.params.id

  	if(id) {
  		lib.db.model('Provider')
  			.findOne({_id: id})
  			.exec(function(err, provider) {
	  			if(err) return next(controller.RESTError('InternalServerError', err))
	  			if(!author) {
	  				return next(controller.RESTError('ResourceNotFoundError', 'Dataset provider not found'))
	  			}
	  			controller.writeHAL(res, provider)
  			})
  	} else {
  		next(controller.RESTError('InvalidArgumentError', 'Missing providers id'))
  	}
  })

  //post

  controller.addAction({
  	'path': '/providers',
  	'summary': 'Adds a new dataset provider to the database',
  	'method': 'POST',
  	'params': [swagger.bodyParam('provider', 'JSON representation of the data', 'string')],
  	'responseClass': 'Provider',
  	'nickname': 'addProvider'
  }, function (req, res, next) {
  	var body = req.body

  	if(body) {
  		var newAuthor = lib.db.model('Provider')(body)
  		newProvider.save(function(err, author) {
			if(err) return next(controller.RESTError('InternalServerError', err))
			controller.writeHAL(res, provider)
		})
  	} else {
  		next(controller.RESTError('InvalidArgumentError', 'Missing provider id'))
  	}
  })

  //put

  controller.addAction({
  	'path': '/providers/{id}',
  	'method': 'PUT',
  	'summary': "UPDATES an provider's information",
  	'params': [swagger.pathParam('id','The id of the provider','string'), 
  				swagger.bodyParam('author', 'The new information to update', 'string')],
  	'responseClass': 'Provider',
  	'nickname': 'updateProvider'
  }, function (req, res, next) {
  	var data = req.body
  	var id = req.params.id
  	if(id) {
  		
  		lib.db.model("Provider").findOne({_id: id}).exec(function(err, provider) {
	 		if(err) return next(controller.RESTError('InternalServerError', err))
	        if(!author) return next(controller.RESTError('ResourceNotFoundError', 'The provider was not found'))
		  		provider = _.extend(author, data)
		  		provider.save(function(err, data) {
			 		if(err) return next(controller.RESTError('InternalServerError', err))
            controller.writeHAL(res, data)
		  		})
  		})
  	} else {
  		next(controller.RESTError('InvalidArgumentError', 'Invalid id received'))
  	}
  })

  // /books
  controller.addAction({
  	'path': '/providers/{id}/frenchbeans',
  	'summary': 'Returns all the datasets of one specific provider',
  	'method': 'GET',
  	'params': [ swagger.pathParam('id', 'The id of the provider', 'string')],
  	'responseClass': 'Frenchbeans',
  	'nickname': 'getProvidersData'
  }, function (req, res, next) {
  	var id = req.params.id

  	if(id) {
  		lib.db.model('Provider')
  			.findOne({_id: id})
  			.populate('frenchbeans')
  			.exec(function(err, author) {
	  			if(err) return next(controller.RESTError('InternalServerError', err))
	  			if(!author) {
	  				return next(controller.RESTError('ResourceNotFoundError', 'The provider was not found'))
	  			}
	  			controller.writeHAL(res, author.books)
  			})
  	} else {
  		next(controller.RESTError('InvalidArgumentError', 'Missing provider id'))
  	}
  })



  return controller
}
