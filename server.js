const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Insert configuration into process.env
dotenv.config({ path: './config.env' })
const app = require('./app')

// Connect to local db
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'))

// Port and server
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
