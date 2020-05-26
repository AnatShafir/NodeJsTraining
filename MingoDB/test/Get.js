const { expect } = require('chai')
const Rimraf = require('rimraf')

const testUtils = require('./TestUtils')
const { insertFileToDB, testCollection, testObject, DBDirectoryPath } = require('./TestUtils')

describe('DB - #get()', () => {
  before((done) => {
    insertFileToDB(testObject, done)
  })
  
  after((done) => {
    Rimraf(`${DBDirectoryPath}/${testCollection}/*`, done);
  })

  it('Should get an object from the DB', (done) => {
    testUtils.db.get(testCollection, testObject.id, (err, result) => {
      if (err) return done(err)
      expect(result).to.eql(testObject)
      done()
    })
  })
  
  it(`Should return null when the collection doesn't exist`, (done) => {
    const newCollection = 'newCollection'
    testUtils.db.get(newCollection, testObject.id, (err, result) => {
      if (err) return done(err)
      expect(result).to.not.exist
      done()
    })
  })
  
  it(`Should return null when the id doesn't exist`, (done) => {
    const newId = '1234567'
    testUtils.db.get(testCollection, newId, (err, result) => {
      if (err) return done(err)
      expect(result).to.not.exist
      done()
    })
  })
})