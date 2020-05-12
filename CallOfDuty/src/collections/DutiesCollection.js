const appUtils = require('../AppUtils')

const collection = {
  postDuty: async (objectToPost) => {
    return await appUtils.post(objectToPost, ['name', 'location', 'days', 'constraints',
                               'soldiersRequired', 'value'], 'soldiers',
                               appUtils.callOfDuty.dutiesCollection)
  },
  getDuty: async (query) => {
    return await appUtils.findInDB(appUtils.callOfDuty.dutiesCollection, appUtils.createQueryFunction(query))
  },
  getDutyByID: async (dutyId) => {
    return await appUtils.getFromDB(appUtils.callOfDuty.dutiesCollection, dutyId)
  }
}

module.exports = collection