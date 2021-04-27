const { Note } = require('../schemas/note.schema')
const uuid = require('uuid')
const notesRouter = require('express').Router()

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({ authorID: 1 })
  response.json(notes)
})

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const note = new Note({
    content: body.content,
    id: uuid.v4(),
    authorID: 1,
  })
  const savedNote = await note.save()
  response.json(savedNote)
})

notesRouter.put('/:id', async (request, response) => {
  const body = request.body
  const noteID = request.params.id
  const note = await Note.findOne({ id: noteID })
  note.content = body.content
  console.log(body)
  const savedNote = await note.save()
  response.json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  const noteID = request.params.id
  await Note.deleteOne({ id: noteID })
  response.status(200).json({})
})

module.exports = notesRouter
