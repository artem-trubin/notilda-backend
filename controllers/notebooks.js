const notebooksRouter = require('express').Router()
const { Notebook } = require('../schemas/notebook.schema')
const { User } = require('../schemas/user.schema')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const { getTokenFrom } = require('../common/helpers')

notebooksRouter.get('/', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findOne({id: decodedToken.id})

  const notebooks = await Notebook.find({author: user.id})

  response.json(notebooks)
})

notebooksRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })

  const notebook = new Notebook({
    name: body.name,
    author: user.id,
    id: uuid.v4(),
  })

  const savedNotebook = await notebook.save()
  response.json(savedNotebook)
})

notebooksRouter.put('/:id', async (request, response) => {
  const body = request.body
  const notebookId = request.params.id
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })
  const notebook = await Notebook.findOne({ id: notebookId })
  if (user.id === notebook.author) {
    notebook.name = body.name
    const savedNotebook = await notebook.save()
    response.json(savedNotebook)
  } else {
    console.log('error')
  }
})

notebooksRouter.delete('/:id', async (request, response) => {
  const notebookId = request.params.id
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findOne({ id: decodedToken.id })
  const notebook = await Notebook.findOne({ id: notebookId })
  if (user.id === notebook.author) {
    await Notebook.deleteOne({id: notebookId})
    response.status(200).json({})
  } else {
    console.log('error')
  }
})

module.exports = notebooksRouter
