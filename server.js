const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Insert configuration into process.env
dotenv.config({ path: './config.env' })
const app = require('./app')

// Connect to DB
let AUTH_DATABASE

if (process.env.NODE_ENV === 'development') {
  AUTH_DATABASE = process.env.DATABASE_LOCAL
} else {
  AUTH_DATABASE = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  )
}

mongoose
  .connect(AUTH_DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'))

// Port and server
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
