const bcrypt = require('bcrypt')
const { User } = require('../schemas/user.schema')
const { getTokenFrom } = require('../common/helpers')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 10
    const passhash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        passhash,
        id: uuid.v4(),
    })

    try {
        const savedUser = await user.save()
        response.status(200).json(savedUser)
    } catch (e) {
        response.status(409).json({ error: "Username is taken or invalid." })
    }
})

usersRouter.put('/:id', async (request, response) => {
    const body = request.body
    const paramsID = request.params.id
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'Token missing or invalid.' })
    }
    const user = await User.findOne({ id: decodedToken.id })
    if (user.id === paramsID) {
        user.username = body.username
        const savedUser = user.save()
        return response.status(200).json(savedUser)
    } else {
        return response.status(403).json({ error: 'Access denied' })
    }
})

usersRouter.delete('/:id', async (request, response) => {
    const userID = request.params.id
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'Token missing or invalid.' })
    }
    const user = await User.findOne({ id: decodedToken.id })
    if (user.id === userID) {
        await Todo.deleteMany({ authorID: userID })
        await Group.deleteMany({ authorID: userID })
        await User.deleteOne({ id: userID })
    } else {
        return response.status(403).json({ error: 'Access denied' })
    }
})

module.exports = usersRouter
