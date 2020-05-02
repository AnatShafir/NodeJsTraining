const { promisify } = require('util')

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
  },
  isDutyScheduled: async (dutyId) => {
    const duty = await appUtils.getFromDB(appUtils.callOfDuty.dutiesCollection, dutyId)
    if (duty.soldiers.length != 0) throw new Error('Duty is already scheduled')
    return duty
  },
  deleteDuty: async (dutyId) => {
    await collection.isDutyScheduled(dutyId)
    await promisify(appUtils.callOfDuty.db.delete).call(appUtils.callOfDuty.db, appUtils.callOfDuty.dutiesCollection, dutyId)
  }
}

module.exports = collection