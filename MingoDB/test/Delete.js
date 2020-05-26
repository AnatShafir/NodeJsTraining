const { expect } = require('chai')
const Rimraf = require('rimraf')

const testUtils = require('./TestUtils')
const { insertFileToDB, DBDirectoryPath, testCollection, testObject } = require('./TestUtils')

describe('DB - #delete()', () => {
  beforeEach((done) => {
    insertFileToDB(testObject, done)
  })

  afterEach((done) => {
    Rimraf(`${DBDirectoryPath}/${testCollection}/*`, done)
  })

  it('Should delete an object from the DB', (done) => {
    testUtils.db.delete(testCollection, testObject.id, (err) => {
      if (err) return done(err)
      testUtils.db.get(testCollection, testObject.id, (err, result) => {
        if (err) return done(err)
        expect(result).to.not.exist
        done()
      })
    })
  })

  it(`Shouldn't throw an error when the collection doesn't exist`, (done) => {
    const newCollection = 'newCollection'
    testUtils.db.delete(newCollection, testObject.id, done)
  })
  
  it(`Shouldn't throw an error when the id doesn't exist`, (done) => {
    const newId = '1234567'
    testUtils.db.delete(testCollection, newId, done)
  })
})