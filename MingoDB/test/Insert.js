const Async = require('async')
const Rimraf = require('rimraf')
const Fs = require('fs')
const { expect } = require('chai')

const testUtils = require('./TestUtils')
const { DBDirectoryPath, testCollection, testObject } = require('./TestUtils')

describe('DB - #insert()', () => {
  afterEach((done) => {
    Rimraf(`${DBDirectoryPath}/${testCollection}/*`, done)
  })

  after((done) => {
    Fs.readdir(`${DBDirectoryPath}`, (err, files) => {
      if (err) return done(err)
      Async.each(files, (file, callback) => {
        if (file !== `${testCollection}`) return Rimraf(`${DBDirectoryPath}/${file}`, callback)
        callback()
      }, done)
    })
  })
  
  it('Should insert a new object to DB', (done) => {
    testUtils.db.insert(testCollection, testObject, (err, id) => {
      if (err) return done(err)
      testUtils.db.get(testCollection, id, (err, result) => {
        if (err) return done(err)
        expect(result).to.eql(testObject)
        done()
      })
    })
  })

  it('Should insert an object without an id to DB', (done) => {
    let objectWithoutId = Object.assign({}, testObject)
    delete objectWithoutId.id
    testUtils.db.insert(testCollection, objectWithoutId, (err, id) => {
      if (err) return done(err)
      objectWithoutId.id = id
      testUtils.db.get(testCollection, id, (err, result) => {
        if (err) return done(err)
        expect(result).to.eql(objectWithoutId)
        done()
      })
    })
  })
  
  it('Should replace an object that already exist', (done) => {
    let objectToReplace = Object.assign({}, testObject)
    objectToReplace.rank = 'Rav-Aluf'
    Async.waterfall([
      (callback) => {
        testUtils.db.insert(testCollection, testObject, (err) => {
          if (err) return callback(err)
          callback()
        })
      }, 
      (callback) => {
        testUtils.db.insert(testCollection, objectToReplace, (err) => {
          if (err) return callback(err)
          callback()
        })
      }, 
      (callback) => {
        testUtils.db.get(testCollection, testObject.id, callback)
      }
    ], 
    (err, result) => {
      if (err) return done(err)
      expect(result).to.eql(objectToReplace)
      done()
    })
  })

  it(`Should insert an object to a collection that doesn't exist`, (done) => {
    const newCollection = 'newCollection'
    testUtils.db.insert(newCollection, testObject, (err, id) => {
      if (err) return done(err)
      testUtils.db.get(newCollection, id, (err, result) => {
        if (err) return done(err)
        expect(result).to.eql(testObject)
        done()
      })
    })
  })
})
