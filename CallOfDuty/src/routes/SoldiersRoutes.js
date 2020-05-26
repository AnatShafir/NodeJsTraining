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
  .get(async (req, res) => {
    try {
      appUtils.resolveRequest(res, await soldiersCollection.getSoldier(req.query))
    } catch (err) {
      appUtils.rejectRequest(res, err)
    }
  })
soldiersRouter.get('/:id', async (req, res) => {
  try {
    appUtils.resolveRequest(res, await soldiersCollection.getSoldierByID(req.params.id))
  } catch (err) {
    appUtils.rejectRequest(res, err)
  }
})

module.exports.loadSoldiersRoutes = (app) => {
  app.use('/soldiers', soldiersRouter)
}