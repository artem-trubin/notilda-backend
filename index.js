const express = require('express')
const app = express()
const cors = require('cors')
const uuid = require('uuid')
const mongoose = require('mongoose')
require('dotenv').config()
app.use(express.json())
app.use(cors())

const url = process.env.MONGODB_URI

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const notebooksRouter = require('./controllers/notebooks')
const notesRouter = require('./controllers/notes')

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/notebooks', notebooksRouter)
app.use('/api/notes', notesRouter)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
