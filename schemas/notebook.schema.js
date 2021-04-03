const mongoose = require('mongoose')

const notebookSchema = new mongoose.Schema({
  name: String,
  id: String,
  author: {
    type: String,
    ref: 'Author'
  },

})

notebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Notebook = mongoose.model('Notebook', notebookSchema)

module.exports = { Notebook }
