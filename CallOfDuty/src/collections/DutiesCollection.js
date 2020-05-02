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
  },
  updateDuty: async (patch, reqId) => {
    if (patch.id != reqId) {
      throw new Error(`Patch's id must match original duty's id`)
    } else {
      let duty = await collection.isDutyScheduled(patch.id)
      if (!Object.keys(patch).every(property => duty.hasOwnProperty(property))) {
        throw new Error('Patch properties must match original duty properties')
      } else {
        Object.keys(patch).forEach(property => duty[property] = patch[property])
        return await appUtils.insertToDB(appUtils.callOfDuty.dutiesCollection, duty)
      } 
    } 
  },
  scheduleDuty: async (dutyId) => {
    const duty = await collection.isDutyScheduled(dutyId)
    const justiceBoard = await appUtils.calcJusticeBoard()
    justiceBoard.sort((firstSoldier, secondSoldier) => firstSoldier.score - secondSoldier.score)
    let matchedSoldiers = [], soldierIndex = 0
    while ((duty.soldiersRequired != matchedSoldiers.length) && (soldierIndex < justiceBoard.length)) {
      const soldier = await appUtils.getFromDB(appUtils.callOfDuty.soldiersCollection, justiceBoard[soldierIndex].id)
      const isSoldierMatching = duty.constraints.every((constraint) => !soldier.limitations.includes(constraint))
      if (isSoldierMatching) {
        matchedSoldiers.push(soldier)
      }
      soldierIndex++
    }
    if (duty.soldiersRequired != matchedSoldiers.length) {
      throw new Error('Not enough soldiers that match the constraints to schedule duty')
    }
    duty.soldiers = matchedSoldiers.map((soldier) => soldier.id)
    await appUtils.insertToDB(appUtils.callOfDuty.dutiesCollection, duty)
    matchedSoldiers.forEach(async (soldier) => {
      soldier.duties.push(duty.id)
      await appUtils.insertToDB(appUtils.callOfDuty.soldiersCollection, soldier)
    })
    return duty.id
  }
}

module.exports = collection