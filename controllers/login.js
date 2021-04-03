const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { User } = require('../schemas/user.schema')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  
  const user = await User.findOne({ userName: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passHash)


  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid username or password.'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.userName, id: user.id })
})

module.exports = loginRouter
