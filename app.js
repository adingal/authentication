const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const errorController = require('./controllers/errorController')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

// User routes
const userRouter = require('./routes/userRoutes')

const app = express()

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Set security HTTP headers
app.use(helmet())

// Limit request for 50 per hour same IP
const limiter = rateLimit({
  max: 999,
  windowMs: 60 * 60 * 500,
  message: 'Too many request from this IP, please try again in an hour.',
})
app.use('/api', limiter)

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Parse incoming request to JSON
app.use(express.json({ limit: '10kb' }))

// Use this route as public
app.use(express.static(`${__dirname}/public`))

// Enable cors
app.use(cors())

// Routes
app.use('/api/v1/users', userRouter)

// Catch all handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  })

  next()
})

// Global error handler
app.use(errorController)

module.exports = app
