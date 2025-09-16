import productModel from '~/models/products'
import { Types } from 'mongoose'
import { DEFAULT_ITEM_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

const escapeRegExp = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildRegexFromQuery = (q = '') => {
  const tokens = String(q).trim().split(/\s+/).filter(Boolean).map(t => escapeRegExp(t))
  if (tokens.length === 0) return null
  // match any token (OR) case-insensitive
  return new RegExp(tokens.join('|'), 'i')
}

const getProducts = async (query = {}, page = DEFAULT_PAGE, itemsPerPage = DEFAULT_ITEM_PER_PAGE) => {
  const p = Math.max(1, parseInt(page, 10) || DEFAULT_PAGE)
  const limit = Math.max(1, parseInt(itemsPerPage, 10) || DEFAULT_ITEM_PER_PAGE)

  // Build base mongo query (we'll either use $text or a regex fallback below)
  const mongoQueryBase = { _destroy: { $ne: true } }

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

  // If q is provided, try $text search first. If it returns no results, fall back to a simple regex "fuzzy" search.
  if (query.q) {
    // First attempt: text search (requires text index which exists on products)
    const textQuery = { ...mongoQueryBase, $text: { $search: query.q } }
    // include other filters (category, inStock, etc.) into textQuery
    const mergedQuery = { ...textQuery }
    if (query.category && query.category !== 'All Categories') mergedQuery.category = query.category
    if (query.inStock !== undefined) mergedQuery.inStock = query.inStock === 'true' || query.inStock === true
    if (query.onSale !== undefined) mergedQuery.isOnSale = query.onSale === 'true' || query.onSale === true
    if (query.minPrice || query.maxPrice) {
      mergedQuery.price = {}
      if (query.minPrice) mergedQuery.price.$gte = Number(query.minPrice)
      if (query.maxPrice) mergedQuery.price.$lte = Number(query.maxPrice)
    }
    if (query.minRating) mergedQuery.rating = { $gte: Number(query.minRating) }

    const [textItems, textTotal] = await Promise.all([
      productModel.find(mergedQuery).sort(sort).skip((p - 1) * limit).limit(limit).lean(),
      productModel.countDocuments(mergedQuery)
    ])

    if (textItems && textItems.length > 0) {
      return { items: textItems, total: textTotal, page: p, itemsPerPage: limit }
    }

    // Fallback: build a regex matching any token from the query and search important fields
    const regex = buildRegexFromQuery(query.q)
    if (regex) {
      const regexQuery = { ...mongoQueryBase, $or: [ { name: regex }, { description: regex }, { tags: regex } ] }
      // apply same filters to regexQuery
      if (query.category && query.category !== 'All Categories') regexQuery.category = query.category
      if (query.inStock !== undefined) regexQuery.inStock = query.inStock === 'true' || query.inStock === true
      if (query.onSale !== undefined) regexQuery.isOnSale = query.onSale === 'true' || query.onSale === true
      if (query.minPrice || query.maxPrice) {
        regexQuery.price = {}
        if (query.minPrice) regexQuery.price.$gte = Number(query.minPrice)
        if (query.maxPrice) regexQuery.price.$lte = Number(query.maxPrice)
      }
      if (query.minRating) regexQuery.rating = { $gte: Number(query.minRating) }

      const [items, total] = await Promise.all([
        productModel.find(regexQuery).sort(sort).skip((p - 1) * limit).limit(limit).lean(),
        productModel.countDocuments(regexQuery)
      ])

      return { items, total, page: p, itemsPerPage: limit }
    }
  }

  // Default: no q provided; use base query with filters
  const mongoQuery = { ...mongoQueryBase }
  if (query.category && query.category !== 'All Categories') mongoQuery.category = query.category
  if (query.inStock !== undefined) mongoQuery.inStock = query.inStock === 'true' || query.inStock === true
  if (query.onSale !== undefined) mongoQuery.isOnSale = query.onSale === 'true' || query.onSale === true
  if (query.minPrice || query.maxPrice) {
    mongoQuery.price = {}
    if (query.minPrice) mongoQuery.price.$gte = Number(query.minPrice)
    if (query.maxPrice) mongoQuery.price.$lte = Number(query.maxPrice)
  }
  if (query.minRating) mongoQuery.rating = { $gte: Number(query.minRating) }

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
