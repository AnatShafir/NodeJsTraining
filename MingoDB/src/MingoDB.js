const Fs = require("fs")

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