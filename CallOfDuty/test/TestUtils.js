const Http = require('http')
const Fs = require('fs')
const Rimraf = require('rimraf')
const { promisify } = require('util')

const mingoDB = require('../../MingoDB/src/MingoDB')
const callOfDuty = require('../src/CallOfDuty')

before(async () => {
  if (callOfDuty.server) callOfDuty.server.close()
  await promisify(Fs.mkdir).call(Fs, testUtils.DBDirectoryPath)
  callOfDuty.startServer(await promisify(mingoDB.connect).call(mingoDB, testUtils.DBDirectoryPath),
                         testUtils.port)
})

after(async () => {
  callOfDuty.server.close()
  await promisify(Rimraf).call(this, testUtils.DBDirectoryPath)
})

afterEach(async () => {
  await promisify(Rimraf).call(this, `${testUtils.DBDirectoryPath}/*`)
})

const testUtils = {
  DBDirectoryPath: './DBTestDirectory',
  port: 8080,
  httpRequest: async (requestOptions, body) => {
    return new Promise((resolve, reject) => {
      let req = Http.request(requestOptions, (response) => {
        let fullResponse = ''
        response.on('data', (chunk) => fullResponse += chunk.toString())
                .on('end', () => resolve(fullResponse))
                .on('err', reject)
      })
      req.end(body)
    }) 
  },
  testSoldiers: [
    {
      id: '8629630',
      name: 'Anat Shafir',
      rank: 'Rbt',
      limitations: ['using weapons', 'heavy lifting']
    },
    {
      id: '1234567',
      name: 'Mia Betzalel',
      rank: 'Rbt',
      limitations: []
    },
    {
      id: '7654321',
      name: 'Anat Shafir',
      rank: 'Rav-Aluf',
      limitations: ['heavy lifting']
    }
  ],
  requestOptions: {
    postSoldiers: {
      path: '/soldiers',
      method: 'POST'
    },
    getSoldiers: {
      path: '/soldiers',
      method: 'GET'
    },
    postDuties: {
      path: '/duties',
      method: 'POST'
    },
    getDuties: {
      path: '/duties',
      method: 'GET'
    }
  },
  postAllSoldiers: async () => {
    for (const soldier of testUtils.expectedSoldiers) {
      await testUtils.insertSoldier(soldier)
    }
  },
  insertSoldier: async (soldier) => {
    return await callOfDuty.appUtils.insertToDB(callOfDuty.soldiersCollection, soldier)
  },
  ammendRequestPath: (requestOptions, path) => {
    let requestOptionsWithPath = Object.assign({}, requestOptions)
    requestOptionsWithPath.path += path
    return requestOptionsWithPath
  },
  testDuties: [
    {
      name: 'kitchen',
      location: 'kirya',
      days: {
        startDate: "2020-04-13",
        endDate: "2020-04-15"
      },
      constraints: ['heavy lifting', 'standing'],
      soldiersRequired: 1,
      value: 5
    }, 
    {
      name: 'gaurding',
      location: 'kirya',
      days: {
        startDate: "2020-04-13",
        endDate: "2020-04-15"
      },
      constraints: ['using weapons', 'standing'],
      soldiersRequired: 2,
      value: 10
    }, 
    {
      name: 'gaurding',
      location: 'kirya',
      days: {
        startDate: "2020-04-13",
        endDate: "2020-04-15"
      },
      constraints: ['standing'],
      soldiersRequired: 3,
      value: 7
    }
  ],
  getDutyFromDB: async (dutyId) => {
    return await callOfDuty.appUtils.getFromDB(callOfDuty.dutiesCollection, dutyId)
  },
  postAllDuties: async () => {
    for (const duty of testUtils.expectedDuties) {
      await testUtils.insertDuty(duty)
    }
  },
  insertDuty: async (duty) => {
    duty.id = await callOfDuty.appUtils.insertToDB(callOfDuty.dutiesCollection, duty)
  }
}

Object.keys(testUtils.requestOptions).map(key => testUtils.requestOptions[key].port = testUtils.port)
testUtils.expectedSoldiers = testUtils.testSoldiers.map((testSoldier) => {
  let expectedSoldier = Object.assign({}, testSoldier)
  expectedSoldier.duties = []
  return expectedSoldier
})
testUtils.expectedDuties = testUtils.testDuties.map((testDuty) => {
  let expectedDuty = Object.assign({}, testDuty)
  expectedDuty.soldiers = []
  return expectedDuty
})

module.exports = testUtils