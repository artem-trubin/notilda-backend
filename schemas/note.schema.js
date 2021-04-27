// Requirements
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const noteSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  content: Array,
  authorID: String,
  notebookID: String,
  tags: Array,
})

noteSchema.plugin(uniqueValidator)

// Deleting mongoDB properties when transforming to JSON
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passHash
  }
})

const Note = mongoose.model('Note', noteSchema)

module.exports = { Note }
