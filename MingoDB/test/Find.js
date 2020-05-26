const { expect } = require('chai')
const Async = require('async')
const Rimraf = require('rimraf')

const testUtils = require('./TestUtils')
const { insertFileToDB, DBDirectoryPath, testCollection, 
        testObject, secondObject, thirdObject } = require('./TestUtils')

describe('DB - #find()', () => {
  before((done) => {
    Async.each([testObject, secondObject, thirdObject], insertFileToDB, done)
  })

  after((done) => {
    Rimraf(`${DBDirectoryPath}/${testCollection}/*`, done)
  })

  it('Should find a single match', (done) => {
    const queryFunction = (document) => document.hasOwnProperty('rank') && document.rank == 'Rav-Aluf'
    testUtils.db.find(testCollection, queryFunction, (err, resultArray) => {
      if (err) return done(err)
      expect(resultArray).to.have.deep.members([thirdObject])
      done()
    })
  })

  it('Should find multiple matches', (done) => {
    const queryFunction = (document) => document.hasOwnProperty('rank') && document.rank == 'Rbt'
    testUtils.db.find(testCollection, queryFunction, (err, resultArray) => {
      if (err) return done(err)
      expect(resultArray).to.have.deep.members([testObject, secondObject])
      done()
    })
  })

  it(`Shouldn't find matches`, (done) => {
    const queryFunction = (document) => document.hasOwnProperty('name') && document.name == 'Mia Betzalel'
    testUtils.db.find(testCollection, queryFunction, (err, resultArray) => {
      if (err) return done(err)
      expect(resultArray).to.have.deep.members([])
      done()
    })
  })
})