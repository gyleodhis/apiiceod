var BaseController = require("./basecontroller"),
  _ = require("underscore"),
  swagger = require("swagger-node-restify")



function Frenchbeans() {
}

Frenchbeans.prototype = new BaseController()

module.exports = function(lib) {
  var controller = new Frenchbeans();


  /**
    Helper function for the POST action
    */
  function mergeStores(list1, list2) {
    var stores1 = {}
    var stores2 = {}
    _.each(list1, function(st) {
      if(st.store)
        stores1[st.store] = st.copies
    })
    _.each(list2, function(st) {
      if(st.store)
        stores2[st.store] = st.copies
    })
    var stores = _.extend(stores1, stores2)
    return _.map(stores, function(v, k) {
      return {store: k, copies: v}
    })
  }


  controller.addAction({
        'path': '/frenchbeans',
        'method': 'GET',
        'summary': 'Returns a JSON file for Frenchbeans',
        "params": [ swagger.queryParam('q', 'Search term', 'string'), swagger.queryParam('genre','Filter by no_rust', 'string')],
        'responseClass': 'Dataset',
        'nickname': 'getFrenchbeans'
      }, function(req, res, next) {

        var criteria = {}
        if(req.params.q) {
          var expr = new RegExp('.*' + req.params.q + '.*')
          criteria.$or = [
            {canopy: expr},
            {ipm: expr},
            {no_thrips: expr}
          ]
        }
        if(req.params.no_rust) {
          criteria.no_rust = req.params.no_rust
        }

        lib.db.model('Dataset')
          .find(criteria)
          .populate('stores.store')
          .exec(function(err, books) {
          if(err) return next(err)
          controller.writeHAL(res, books)
        })
      })

   controller.addAction({
        'path': '/frenchbeans/{id}',
        'method': 'GET',
        'params': [ swagger.pathParam('id', 'The Id of the frenchbeans','int') ],
        'summary': 'Returns the full data of a the beans',
        'nickname': 'getFrenchbeans'
      }, function(req, res, next) {
        var id = req.params.id
        if(id) {
          lib.db.model("Dataset")
            .findOne({_id: id})
            .populate('id')
            .populate('canopy')
            .populate('ipm')
            .populate('no_rust')
            .populate('no_thrips')
            .populate('all_control')
            .populate('providers')
            .exec(function(err, frenchbeans) {
              if(err) return next(controller.RESTError('InternalServerError', err))
              if(!book) {
                return next(controller.RESTError('ResourceNotFoundError', 'Beans not found'))
              }
              controller.writeHAL(res, frenchbeans)
            })
        } else {
          next(controller.RESTError('InvalidArgumentError', 'Missing beans id'))
        }
      })

  controller.addAction({
        'path': '/frenchbeans',
        'method': 'POST',
        'params': [ swagger.bodyParam('frenchbeans', 'JSON representation of the new dataset','string') ],
        'summary': 'Adds a new dataset into the collectoin',
        'nickname': 'newData'
      }, function(req, res, next) {
        var frenchbeansData = req.body 
        if(frenchbeansData) {
          ipm = frenchbeansData.ipm
          lib.db.model("Dataset")
            .findOne({ipm: ipm})
            .exec(function(err, frenchbeanModel) {
              if(!frenchbeanModel) {
                frenchbeanModel = lib.db.model("Dataset")(frenchbeanModel)
              } else {
                // This statement return nothing. 
              }
              frenchbeanModel.save(function(err, frenchbeans) {
                  if(err) return next(controller.RESTError('InternalServerError', err))
                  controller.writeHAL(res, frenchbeans)
                })
            })
          
        } else {
          next(controller.RESTError('InvalidArgumentError', 'Missing content of dataset'))
        }
      })

  controller.addAction({
        'path': '/frenchbeans/{id}/providers',
        'method': 'GET',
        'params': [ swagger.pathParam('id', 'The Id of the dataset','int') ],
        'summary': 'Returns the list of providers of one particular dataset',
        'nickname': 'getDataProviders'
      }, function(req, res, next) {
        var id = req.params.id
        if(id) {
          lib.db.model("Dataset")
            .findOne({_id: id})
            .populate('providers')
            .exec(function(err, frenchbeans) {
              if(err) return next(controller.RESTError('InternalServerError', err))
              if(!frenchbeans) {
                return next(controller.RESTError('ResourceNotFoundError', 'Data not found'))
              }
              controller.writeHAL(res, frenchbeans.providers)
            })
        } else {
          next(controller.RESTError('InvalidArgumentError', 'Missing data id'))
        }
      })
  controller.addAction({
        'path': '/frenchbeans/{id}/reviews',
        'method': 'GET',
        'params': [ swagger.pathParam('id', 'The Id of the dataset','int') ],
        'summary': 'Returns the list of reviews of one specific dataset',
        'nickname': 'getDataReviews'
      }, function(req, res,next) {
        var id = req.params.id
        if(id) {
          lib.db.model("Dataset")
            .findOne({_id: id})
            .populate('reviews')
            .exec(function(err, frenchbeans) {
              if(err) return next(controller.RESTError('InternalServerError', err))
              if(!book) {
                return next(controller.RESTError('ResourceNotFoundError', 'The frenchbeans data not found'))
              }
              controller.writeHAL(res, frenchbeans.reviews)
            })
        } else {
          next(controller.RESTError('InvalidArgumentError', 'Missing beans id'))
        }
      })
  
  controller.addAction({
        'path': '/frenchbeans/{id}',
        'method': 'PUT',
        'params': [ swagger.pathParam('id', 'The Id of the frenchbeans to update','string'),
                   swagger.bodyParam('frenchbeans', 'The data to change on the frenchbeans', 'string') ],
        'summary': 'Updates the information of one specific frenchbeans',
        'nickname': 'updateData'
      }, function(req, res, next) {
          var data = req.body
          var id = req.params.id
          if(id) {
            
            lib.db.model("Dataset").findOne({_id: id}).exec(function(err, book) {
            if(err) return next(controller.RESTError('InternalServerError', err))
              //Replacing book with frenchbeans.
              if(!frenchbeans) return next(controller.RESTError('ResourceNotFoundError', 'Data not found'))
              frenchbeans = _.extend(frenchbeans, data)
              frenchbeans.save(function(err, data) {
              if(err) return next(controller.RESTError('InternalServerError', err))
               controller.writeHAL(res, data.toJSON())
              })
            })
          } else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid id received'))
          }
      })
  return controller
}
