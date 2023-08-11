const express = require('express')
const { use } = require('express/lib/application')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const conpression = require('compression')

const app = express()

// init middlewares
// Show log khi run watch
app.use(morgan("dev"))
// morgan("combined")
// morgan("common")
// morgan("short")
// morgan("tiny")
// morgan("dev")

// Ngan chan nguoi dung check xem mình sử dụng côngg nghệ gì để tấn công, chặn người dùng lấy cookie,...
app.use(helmet())

// Truyen tai du lieu den client se gon nhe hon rat nhieu lan
app.use(conpression())

// init db
require('./dbs/init.mongodb')
// const { checkOverLoad } = require('./helpers/check.connect')
// checkOverLoad()
// init routes
app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Welcome FanTips'
  })
})

// handling error


module.exports = app
