const Express = require('express')

const dutiesCollection = require('../collections/DutiesCollection')
const appUtils = require('../AppUtils')

const dutiesRouter = Express.Router()
const dutiesByIdRouter = Express.Router({mergeParams: true})
dutiesRouter.use('/:id', dutiesByIdRouter)

dutiesRouter.route('/')  
  .post(async (req, res) => {
    try {
      appUtils.resolveRequest(res, 
        await dutiesCollection.postDuty(await appUtils.getAndProcessData(req)))
    } catch (err) {
      appUtils.rejectRequest(res, err)
    }
  })
  .get(async (req, res) => {
    try {
      appUtils.resolveRequest(res, await dutiesCollection.getDuty(req.query))
    } catch (err) {
      appUtils.rejectRequest(res, err)
    }
  })
dutiesByIdRouter.route('/')  
  .get(async (req, res) => {
    try {
      appUtils.resolveRequest(res, await dutiesCollection.getDutyByID(req.params.id))
    } catch (err) {
      appUtils.rejectRequest(res, err)
    }
  })

module.exports.loadDutiesRoutes = (app) => {
  app.use('/duties', dutiesRouter)
}