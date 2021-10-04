const Category = require('../models/Category')

class ServicesCategories {
  async get({ id }) {
    const category = await Category.findById(id).populate('user')
    return category
  }

  async getCategories({ limit = 5, offset = 0 } = {}) {
    const query = { state: true }

    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .populate('user', {
          name: 1
        })
    ])
    return { total, categories }
  }

  async create({ name, user }) {
    const newName = name.toUpperCase()

    const data = {
      name: newName,
      user
    }
    const newCategory = new Category(data)
    await newCategory.save()
    return newCategory
  }

  async update({ category, id }) {
    const { state, user, ...data } = category
    data.name = data.name.toUpperCase()

    const categoryUpdated = await Category.findByIdAndUpdate(id, data, {
      new: true
    })
    return categoryUpdated
  }

  async delete({ id }) {
    const categoryDeleted = await Category.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    )
    return categoryDeleted
  }
}

module.exports = ServicesCategories
