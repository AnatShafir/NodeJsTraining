const { promisify } = require('util')

const appUtils = {
  post: async (objectToPost, requiredProperties, fieldToInit, collection) => {
    if (Object.keys(objectToPost).sort().join() === requiredProperties.sort().join()) {
      objectToPost[fieldToInit] = []
      return await appUtils.insertToDB(collection, objectToPost)
    } else {
      throw new Error('Parameters are invalid')
    }
  },
  getAndProcessData: async (req) => {
    return new Promise((resolve, reject) => {
      let object = ''
      req.on('data', (chunk) => object += chunk.toString())
         .on('end', () => resolve(JSON.parse(object)))
         .on('err', reject)
    })
  },
  insertToDB: async (collection, object) => {
    return await promisify(appUtils.callOfDuty.db.insert).call(appUtils.callOfDuty.db, collection, object)
  },
  resolveRequest: (res, data) => {
    res.status(200).send(data)
  },
  rejectRequest: (res, err) => {
    res.status(400).send(err.message)
  }
}

module.exports = appUtils