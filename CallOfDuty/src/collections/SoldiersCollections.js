const appUtils = require('../AppUtils')

module.exports = {
  postSoldier: async (objectToPost) => {
    return await appUtils.post(objectToPost, ['id', 'name', 'rank', 'limitations'], 'duties', 
                               appUtils.callOfDuty.soldiersCollection)
  }
}