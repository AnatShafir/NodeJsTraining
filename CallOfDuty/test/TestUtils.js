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
    }
  ],
  requestOptions: {
    postSoldiers: {
      path: '/soldiers',
      method: 'POST'
    }
  }
}

Object.keys(testUtils.requestOptions).map(key => testUtils.requestOptions[key].port = testUtils.port)

module.exports = testUtils