'use-strict'

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

let index = require('./routes/index')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '../client/build')))
app.use(express.static(path.join(__dirname, '/../', 'node_modules')))

app.use('/api', index)

app.use('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development'
    ? err
    : {}

  // send the error page
  res.status(err.status || 500)
  res.send(err)
})

module.exports = app
