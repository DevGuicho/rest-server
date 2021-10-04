const { Schema, model } = require('mongoose')

const ProductSchema = new Schema({
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
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Categorie',
    required: true
  },
  description: String,
  availability: {
    type: Boolean,
    default: true
  },
  img: String
})

ProductSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id

    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = model('Product', ProductSchema)
