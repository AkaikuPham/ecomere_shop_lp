'use strict'

const mongoose = require('mongoose')

const connectString = `mongodb://localhost:27017/shopDev`
const { countConnect } = require('../helpers/check.connect')
class Database {
  constructor() {
    this.connect()
  }

  //connect
  connect(type = 'mongodb') {
    if (1 === 1) { // Logic nay de check la dang o moi truong dev
      
      mongoose.set('debug', true)
      mongoose.set('debug', {color: true})
    }
    mongoose.connect(connectString, {
      maxPoolSize: 50 // nhom ket noi db xu ly dong thoi
    }).then(_ => {
        countConnect()
        console.log(`Connected MongoDB success Pro`)
      })
      .catch(err => console.log(`Error connect`))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb
