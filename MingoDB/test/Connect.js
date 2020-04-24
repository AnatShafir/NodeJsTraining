const Fs = require('fs')
const { expect } = require('chai')

const MingoDB = require('../src/MingoDB')
const { DBDirectoryPath } = require('./TestUtils')

describe('MingoDB - #connect()', () => {
  afterEach((done) => {
    Fs.chmod(DBDirectoryPath, 0o777, done)
  })
  
  it('Should create a new db object', (done) => {
    MingoDB.connect(DBDirectoryPath, done)
  })
  
  it(`Should throw an error when the dbFolderPath isn't a string`, (done) => {
    let notString = 5
    MingoDB.connect(notString, (err) => { 
      expect(err.message).to.equal('db folder path is not a string') 
      done()
    })
  })
    
  it(`Should throw an error when the dbFolderPath isn't a directory`, (done) => {
    const testFilePath = `${DBDirectoryPath}/testFile.txt`
    Fs.writeFile(testFilePath, null, (err) => {
      if (err) done(err)
      MingoDB.connect(testFilePath, (err) => { 
        expect(err.message).to.equal('db folder path is not a directory') 
        done()
      })
    })
  })

  it.skip(`Should throw an error when there are no permissions for the dbFolderPath`, (done) => {
    Fs.chmod(DBDirectoryPath, 0o111, (err) => {
      if (err) done(err)
      MingoDB.connect(DBDirectoryPath, (err) => { 
        expect(err.message).to.equal('no read/write permissions to db folder path') 
        done()
      })
    })
  })
})