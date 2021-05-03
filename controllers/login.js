const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User } = require('../schemas/user.schema')

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passhash)

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
        .send({
            token,
            username: user.username,
            id: user.id,
        })
})

module.exports = loginRouter
