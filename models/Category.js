const { Schema, model } = require('mongoose')

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true
  },
  state: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

/* CategorySchema.methods.toJSON = function () {
  const { _id, __v, ...category } = this.toObject()
  return { id: _id, ...category }
} */

CategorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id

    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = model('Categorie', CategorySchema)
