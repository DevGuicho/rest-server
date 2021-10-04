const { isValidObjectId } = require('mongoose')
const Category = require('../models/Category')
const Product = require('../models/Product')
const User = require('../models/User')

class ServicesSearch {
  async searchUser({ term }) {
    const isMongoID = isValidObjectId(term)

    if (isMongoID) {
      const user = await User.findById(term)
      return user || {}
    }

    const regex = new RegExp(term, 'i')

    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }]
    })
    return users || []
  }

  async searchCategory({ term }) {
    const isMongoID = isValidObjectId(term)

    if (isMongoID) {
      const category = await Category.findById(term)
      const categories = await Category.find({
        $and: [{ user: term }, { state: true }]
      })
      return category || categories || []
    }

    const regex = new RegExp(term, 'i')

    const categories = await Category.find({ name: regex })
    return categories || []
  }

  async searchProduct({ term }) {
    const isMongoID = isValidObjectId(term)

    if (isMongoID) {
      const product = await Product.findById(term).populate('category', {
        name: 1
      })

      const products = await Product.find({
        $and: [{ user: term }, { state: true }]
      }).populate('category', {
        name: 1
      })

      if (products.length > 0) {
        return products
      }
      const productByCategory = await Product.find({
        $and: [{ category: term }, { state: true }]
      }).populate('category', {
        name: 1
      })

      return product || productByCategory
    }

    const regex = new RegExp(term, 'i')

    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }]
    })
    return products || []
  }
}

module.exports = ServicesSearch
