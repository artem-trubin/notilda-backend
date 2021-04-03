const notesRouter = require('express').Router()
const { Note } = require('../schemas/note.schema')
const { User } = require('../schemas/user.schema')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const { getTokenFrom } = require('../common/helpers')

notesRouter.get('/', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })
  const notes = await Note.find({author: user.id})

  response.json(notes)
})

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })

  const note = new Note({
    content: body.content,
    notebook: body.notebook,
    author: user.id,
    id: uuid.v4(),
  })

  const savedNote = await note.save()
  response.json(savedNote)
})

notesRouter.put('/:id', async (request, response) => {
  const body = request.body
  const noteId = request.params.id
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })
  const note = await Note.findOne({ id: noteId })
  if (user.id === note.author) {
    note.content = body.content
    const savedNote = await note.save()
    response.json(savedNote)
  } else {
    console.log('error')
  }
})

notesRouter.delete('/:id', async (request, response) => {
  const noteId = request.params.id
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })
  const note = await Note.findOne({ id: noteId })
  if (user.id === note.author) {
    await Note.deleteOne({id: noteId})
    response.status(200).json({})
  } else {
    console.log('error')
  }
})

module.exports = notesRouter
