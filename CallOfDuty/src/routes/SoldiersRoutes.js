const Express = require('express')

const soldiersCollection = require('../collections/SoldiersCollections')
const appUtils = require('../AppUtils')

const soldiersRouter = Express.Router()

soldiersRouter.route('/')
  .post(async (req, res) => {
    try {
      appUtils.resolveRequest(res, await soldiersCollection.postSoldier(await appUtils.getAndProcessData(req)))
    } catch (err) {
      appUtils.rejectRequest(res, err)
    }
  })

module.exports.loadSoldiersRoutes = (app) => {
  app.use('/soldiers', soldiersRouter)
}