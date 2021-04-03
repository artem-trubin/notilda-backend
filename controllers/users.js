const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User } = require('../schemas/user.schema')
const { Notebook } = require('../schemas/notebook.schema')
const { getTokenFrom } = require('../common/helpers')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    userName: body.userName,
    displayName: body.userName,
    passHash,
    id: uuid.v4()
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter
