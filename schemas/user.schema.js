// Requirements
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  passhash: String,
  id: {
    type: String,
    unique: true,
  }
})

userSchema.plugin(uniqueValidator)

// Deleting mongoDB properties when transforming to JSON
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
