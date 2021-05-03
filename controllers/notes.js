const { Note } = require('../schemas/note.schema')
const { User } = require('../schemas/user.schema')
const jwt = require('jsonwebtoken')
const { getTokenFrom } = require('../common/helpers')
const uuid = require('uuid')

const errors = require('../common/errors')

const notesRouter = require('express').Router()

notesRouter.get('/', async (request, response) => {
  const token = getTokenFrom(request)
  if (!token) return errors.tokenInvalidOrMissing(response)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })
  const notes = await Note.find({ authorID: user.id })

  response.json(notes)
})

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })

  const note = new Note({
    content: body.content,
    id: uuid.v4(),
    authorID: user.id,
  })
  const savedNote = await note.save()
  response.json(savedNote)
})

notesRouter.put('/:id', async (request, response) => {
  const body = request.body
  const noteID = request.params.id
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })
  const note = await Note.findOne({ id: noteID })
  if (user.id === note.authorID) { 
    note.content = body.content
    const savedNote = await note.save()
    response.json(savedNote)
  } else {
    return response.status(403).json({ error: 'Permission denied' })
  }
})

notesRouter.delete('/:id', async (request, response) => {
  const noteID = request.params.id
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })
  const note = await Note.findOne({ id: noteID })
  if (user.id === note.authorID) {
    await Note.deleteOne({ id: noteID })
    response.status(200).json({})
  } else {
    return response.status(403).json({ error: 'Permission denied' })
  }
})

module.exports = notesRouter
