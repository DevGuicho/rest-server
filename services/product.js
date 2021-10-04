const Product = require('../models/Product')

class ServicesProducts {
  async getAll({ limit = 10, offset = 0 } = {}) {
    const query = { state: true }
    const products = await Product.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .populate('category', {
        name: 1
      })

    const total = await Product.countDocuments(query)

    return { total, products }
  }

  async get({ id }) {
    const product = await Product.findById(id).populate('category')
    return product
  }

  async create({ product }) {
    const newProduct = new Product(product)
    await newProduct.save()
    return newProduct
  }

  async update({ id, product } = {}) {
    const { state, user, ...restProduct } = product
    const productUpdated = await Product.findByIdAndUpdate(id, restProduct, {
      new: true
    })
    return productUpdated
  }

  async delete({ id }) {
    const productDeleted = await Product.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    )
    return productDeleted
  }
}

module.exports = ServicesProducts
