#!/usr/bin/env node

let http = require('http')
let _ = require('lodash')
let trycatch = require('trycatch')
let app = require('./app')
let port = process.env.PORT || 8000
let server = http.createServer(app)

if (process.env.NODE_ENV === 'development') {
  trycatch.configure({'long-stack-traces': true})
}

app.set('port', port)
server.listen(port)
server.on('error', onServerError)
server.on('listening', onListening)

process.on('uncaughtException', _.compose(onError, process.exit))
process.on('unhandledRejection', onError)
process.on('uncaughtApplicationException', onError)


function onError(err) {
  console.log(err.stack)
}

function onServerError(err) {
  if (err.syscall !== 'listen') {
    throw err
  }

  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      console.error(port + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(port + ' is already in use')
      process.exit(1)
      break
    default:
      throw err
  }
}

function onListening() {
  console.log('Listening at: 127.0.0.1:' + port)
}
