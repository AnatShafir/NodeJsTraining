const Fs = require("fs")
const Async = require('async')

class DB {
  constructor(dbPath) {
    this.dbPath = dbPath
  }

  get(collectionName, id, done) {
    Fs.readFile(`${this.dbPath}/${collectionName}/${id}.json`, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') return done()
        return done(err)
      }
      done(null, JSON.parse(data))
    })
  }

  delete(collectionName, id, done) {
    let fullPath = `${this.dbPath}/${collectionName}/${id}.json`
    Async.series([
      (callback) => {
        Fs.access(fullPath, (err) => {
          if (err) {
            if (err.code === 'ENOENT') return done()
            return callback(err)
          }
          callback()
        })
      },
      (callback) => {
        Fs.unlink(fullPath, callback)
      }
    ], done)
  }

  find(collectionName, queryFunction, done) {
    Async.waterfall([
      (callback) => {
        Fs.readdir(`${this.dbPath}/${collectionName}`, callback)
      }, 
      (files, callback) => {
        Async.map(files, (fileName, callback) => this.get(collectionName, fileName.split('.', 1), callback),
         callback)
      }
    ], 
    (err, files) => {
      if (err) return done(err)
      done(null, files.filter(document => queryFunction(document)))
    })
  }
}

module.exports.connect = (dbFolderPath, done) => {
  if (typeof dbFolderPath != 'string') return done(new Error('db folder path is not a string'))
  Fs.stat(dbFolderPath, (err, stats) => {
    if (err) return done(err)
    if (!stats.isDirectory()) return done(new Error('db folder path is not a directory'))
    Fs.access(dbFolderPath, Fs.constants.R_OK | Fs.constants.W_OK, (err) => {
      if (err) return done(new Error('no read/write permissions to db folder path'))
      done(null, new DB(dbFolderPath))
    })
  })
}