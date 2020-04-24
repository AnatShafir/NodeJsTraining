const Fs = require('fs')
const Async = require('async')
const Rimraf = require('rimraf')

const MingoDB = require('../src/MingoDB')

before((done) => {
  Async.series([
    (callback) => {
      Fs.mkdir(testUtils.DBDirectoryPath, callback)
    }, 
    (callback) => {
      Fs.mkdir(`${testUtils.DBDirectoryPath}/${testUtils.testCollection}`, callback)
    }
  ], 
  () => {
    MingoDB.connect(testUtils.DBDirectoryPath, (err, db) => {
      if (err) return done(err)
      testUtils.db = db
      done()
    })
  })
})

after((done) => {
  Rimraf(`${testUtils.DBDirectoryPath}`, done)
})

const testUtils = {
  DBDirectoryPath: './DBTestDirectory',
  testCollection: 'testCollection',
  testObject: {
    id: '8629630',
    name: 'Anat Shafir',
    rank: 'Rbt',
    duties: ['Hafifa']
  },
  secondObject: {
    id: '1234567',
    name: 'Anat Shafir',
    rank: 'Rbt',
    duties: ['Hafifa']
  },
  thirdObject: {
    id: '7654321',
    name: 'Anat Shafir',
    rank: 'Rav-Aluf',
    duties: ['Hafifa']
  },
  insertFileToDB: (object, done) => {
    Fs.writeFile(`${testUtils.DBDirectoryPath}/${testUtils.testCollection}/${object.id}.json`,
      JSON.stringify(object), done)
  }
}

module.exports = testUtils