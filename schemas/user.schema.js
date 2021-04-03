const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
  },
  passHash: String,
  displayName: String,
  id: String,
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
