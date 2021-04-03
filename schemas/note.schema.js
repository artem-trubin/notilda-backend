const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  id: String,
  content: String,
  notebook: {
    type: String,
    ref: 'Notebook',
  },
  author: {
    type: String,
    ref: 'User',
  },
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

module.exports = { Note }
