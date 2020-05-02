const appUtils = require('../AppUtils')

module.exports = {
  postSoldier: async (objectToPost) => {
    return await appUtils.post(objectToPost, ['id', 'name', 'rank', 'limitations'], 'duties', 
                               appUtils.callOfDuty.soldiersCollection)
  },
  getSoldier: async (query) => {
    return await appUtils.findInDB(appUtils.callOfDuty.soldiersCollection, appUtils.createQueryFunction(query))
  },
  getSoldierByID: async (id) => {
    return await appUtils.getFromDB(appUtils.callOfDuty.soldiersCollection, id)
  }
}