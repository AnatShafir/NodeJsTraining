const Express = require('express')

const dutiesCollection = require('../collections/DutiesCollection')
const appUtils = require('../AppUtils')

const dutiesRouter = Express.Router()

dutiesRouter.route('/')  
  .post(async (req, res) => {
    try {
      appUtils.resolveRequest(res, 
        await dutiesCollection.postDuty(await appUtils.getAndProcessData(req)))
    } catch (err) {
      appUtils.rejectRequest(res, err)
    }
  })

module.exports.loadDutiesRoutes = (app) => {
  app.use('/duties', dutiesRouter)
}