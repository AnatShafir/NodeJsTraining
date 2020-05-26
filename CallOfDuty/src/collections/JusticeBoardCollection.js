const appUtils = require('../AppUtils')

module.exports.getJusticeBoard = async () => {
  return await appUtils.calcJusticeBoard()
} 