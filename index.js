// Requirements
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { requestLogger } = require('./common/helpers')

// Getting all variables from .env file
require('dotenv').config()

// Main app
const app = express()

// Use block
app.use(express.json())
app.use(cors())
app.use(requestLogger)

const url = process.env.MONGODB_URI

// Connection to database
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB: ', error.message)
  })

// Routers block
const notesRouter = require('./controllers/notes')

app.use('/api/notes', notesRouter)


// Start of the server
const PORT = process.env.port || 4200
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
