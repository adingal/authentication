const express = require('express')
const morgan = require('morgan')

// User routes
const userRouter = require('./routes/userRoutes')

const app = express()

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Parse incoming request to JSON
app.use(express.json({ limit: '10kb' }))

// Use this route as public
app.use(express.static(`${__dirname}/public`))

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

module.exports = app
