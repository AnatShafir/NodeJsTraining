const Express = require('express')

const justiceBoardCollection = require('../collections/JusticeBoardCollection')
const appUtils = require('../AppUtils')

const justiceBoardRouter = Express.Router()

justiceBoardRouter.get('/', async (req, res) => {
  try {
    appUtils.resolveRequest(res, await justiceBoardCollection.getJusticeBoard())
  } catch (err) {
    appUtils.rejectRequest(res, err)
  }
})

module.exports.loadJusticeBoardRoutes = (app) => {
  app.use('/justiceBoard', justiceBoardRouter)
}