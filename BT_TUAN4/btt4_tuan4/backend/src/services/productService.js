import productModel from '~/models/products'
import { Types } from 'mongoose'
import { DEFAULT_ITEM_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

const getProducts = async (query = {}, page = DEFAULT_PAGE, itemsPerPage = DEFAULT_ITEM_PER_PAGE) => {
  const p = Math.max(1, parseInt(page, 10) || DEFAULT_PAGE)
  const limit = Math.max(1, parseInt(itemsPerPage, 10) || DEFAULT_ITEM_PER_PAGE)

  // Build mongo query
  const mongoQuery = { _destroy: { $ne: true } }

  if (query.q) {
    mongoQuery.$text = { $search: query.q }
  }

  if (query.category && query.category !== 'All Categories') {
    mongoQuery.category = query.category
  }

  if (query.inStock !== undefined) {
    mongoQuery.inStock = query.inStock === 'true' || query.inStock === true
  }

  if (query.onSale !== undefined) {
    mongoQuery.isOnSale = query.onSale === 'true' || query.onSale === true
  }

  if (query.minPrice || query.maxPrice) {
    mongoQuery.price = {}
    if (query.minPrice) mongoQuery.price.$gte = Number(query.minPrice)
    if (query.maxPrice) mongoQuery.price.$lte = Number(query.maxPrice)
  }

  if (query.minRating) {
    mongoQuery.rating = { $gte: Number(query.minRating) }
  }

  // Sorting
  let sort = { createdAt: -1 }
  if (query.sortBy) {
    const order = (query.sortOrder === 'asc') ? 1 : -1
    switch (query.sortBy) {
      case 'name': sort = { name: order }; break
      case 'price': sort = { price: order }; break
      case 'rating': sort = { rating: order }; break
      case 'views': sort = { views: order }; break
      default: break
    }
  }

  const [items, total] = await Promise.all([
    productModel.find(mongoQuery).sort(sort).skip((p - 1) * limit).limit(limit).lean(),
    productModel.countDocuments(mongoQuery)
  ])

  return { items, total, page: p, itemsPerPage: limit }
}

const getProductById = async (id) => {
  if (!Types.ObjectId.isValid(id)) return null
  const product = await productModel.findById(id).lean()
  return product
}

const getCategories = async () => {
  const categories = await productModel.distinct('category', { _destroy: { $ne: true } })
  return categories
}

export const productService = { getProducts, getProductById, getCategories }
