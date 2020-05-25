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
  },
  findInDB: async (collection, queryFunction) => {
    return await promisify(appUtils.callOfDuty.db.find).call(appUtils.callOfDuty.db, collection, queryFunction)
  },
  createQueryFunction: (query) => {
    if (query.name) {
      return (document) => document.hasOwnProperty('name') && document.name === query.name
    } else {
      return () => true
    }
  },
  getFromDB: async (collection, id) => {
    return await promisify(appUtils.callOfDuty.db.get).call(appUtils.callOfDuty.db, collection, id)
  },
  calcJusticeBoard: async () => {
    const soldiersArray = await appUtils.findInDB(appUtils.callOfDuty.soldiersCollection, () => true)
    return await Promise.all(soldiersArray.map(async soldier => {
      const dutiesValues = await Promise.all(soldier.duties.map(async dutyId => 
        (await appUtils.getFromDB(appUtils.callOfDuty.dutiesCollection, dutyId)).value))
      return { 
        id: soldier.id, 
        score: dutiesValues.reduce((totalValue, dutyValue) => totalValue + dutyValue, 0) 
      }
    }))
  }
}

module.exports = appUtils