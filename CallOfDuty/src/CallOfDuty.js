const Express = require('express')

const { loadSoldiersRoutes } = require('./routes/SoldiersRoutes')
const appUtils = require('./AppUtils')

const callOfDuty = {
  app: Express(),
  startServer: (db, port) => {
    callOfDuty.db = db
    callOfDuty.soldiersCollection = 'soldiersCollection'
    callOfDuty.dutiesCollection = 'dutiesCollection'
    appUtils.callOfDuty = callOfDuty
    loadSoldiersRoutes(callOfDuty.app)
    callOfDuty.server = callOfDuty.app.listen(port)
  },
  appUtils: appUtils
}

module.exports = callOfDuty