const appUtils = require('../AppUtils')

const collection = {
  postDuty: async (objectToPost) => {
    return await appUtils.post(objectToPost, ['name', 'location', 'days', 'constraints',
                               'soldiersRequired', 'value'], 'soldiers',
                               appUtils.callOfDuty.dutiesCollection)
  }
}

module.exports = collection