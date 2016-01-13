let express = require('express')
let passport = require('passport')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let mongoose = require('mongoose')
let then = require('express-then')
let morgan = require('morgan')
let flash = require('connect-flash')
let requireDir = require('require-dir')
let config = requireDir('./config', {recurse: true})
let routes = require('./routes')
let passportMiddleware = require('./middleware/passport')
const NODE_ENV = process.env.NODE_ENV

// connect to database
//mongoose.connect(config.database[NODE_ENV].url)
mongoose.connect('mongodb://127.0.0.1:27017/authenticator')

let app = express()
app.passport = passportMiddleware(config.auth[NODE_ENV])
app.use(morgan('dev'))
app.use(cookieParser('ilovethenodejs'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
  secret: 'ilovethenodejs',
  resave: true,
  saveUninitialized: true
}))

// Use the passport middleware to enable passport
app.use(passport.initialize())

// Enable passport persistent sessions
app.use(passport.session())
app.use(flash())

// Add routes
routes(app)

// catch 404 and forward to error handler
app.use(then((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
}))

// error handlers
app.use(then(async (err, req, res, next) => {
  let message = process.env.NODE_ENV === 'development' ? err.stack : err.message
  res.status(err.status || 500).json({message})
}))

module.exports = app
