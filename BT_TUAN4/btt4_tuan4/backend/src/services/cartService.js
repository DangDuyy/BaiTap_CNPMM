import cartModel from '~/models/carts'
import productModel from '~/models/products'
import { Types } from 'mongoose'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getOrCreateCart = async (userId) => {
  let cart = await cartModel.findOne({ owner: userId })
  if (!cart) cart = await cartModel.create({ owner: userId, items: [] })
  return cart
}

const getCart = async (userId) => {
  // return cart with populated product info for each item
  let cart = await cartModel.findOne({ owner: userId }).populate('items.productId').lean()
  if (!cart) {
    await cartModel.create({ owner: userId, items: [] })
    cart = await cartModel.findOne({ owner: userId }).populate('items.productId').lean()
  }
  return cart
}

const addItem = async (userId, productId, quantity = 1) => {
  const cart = await getOrCreateCart(userId)
  console.log('[cartService] addItem user:', userId, 'productId:', productId, 'quantity:', quantity)
  if (!Types.ObjectId.isValid(productId)) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid productId')

  const product = await productModel.findById(productId).lean()
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

  const existing = cart.items.find(it => it.productId.toString() === productId.toString())
  if (existing) {
    existing.quantity = existing.quantity + Number(quantity)
  } else {
    cart.items.push({ productId, name: product.name, price: product.price, quantity })
  }

  await cart.save()
  // return populated cart
  const populated = await cartModel.findOne({ owner: userId }).populate('items.productId').lean()
  return populated
}

const updateItem = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId)
  console.log('[cartService] updateItem user:', userId, 'itemId:', itemId, 'quantity:', quantity)
  if (!Types.ObjectId.isValid(itemId)) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid itemId')
  let item = cart.items.id ? cart.items.id(itemId) : undefined
  // Fallback for plain arrays or unexpected shapes
  if (!item) {
    const idx = cart.items.findIndex(it => {
      const idVal = (it && (it._id || it.id))
      return String(idVal) === String(itemId)
    })
    if (idx === -1) throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found')
    item = cart.items[idx]
    if (quantity <= 0) {
      // remove by index
      cart.items.splice(idx, 1)
    } else {
      cart.items[idx].quantity = quantity
    }
  } else {
    if (quantity <= 0) {
      if (typeof item.remove === 'function') item.remove()
      else {
        // support unexpected non-subdocument shape
        const idx = cart.items.findIndex(it => String((it && (it._id || it.id))) === String(itemId))
        if (idx !== -1) cart.items.splice(idx, 1)
      }
    } else {
      item.quantity = quantity
    }
  }
  await cart.save()
  const populated = await cartModel.findOne({ owner: userId }).populate('items.productId').lean()
  return populated
}

const removeItem = async (userId, itemId) => {
  try {
    const cart = await getOrCreateCart(userId)
    console.log('[cartService] removeItem user:', userId, 'itemId:', itemId)
    if (!Types.ObjectId.isValid(itemId)) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid itemId')
    // Try subdocument removal first
    let item = cart.items.id ? cart.items.id(itemId) : undefined
    if (item) {
      if (typeof item.remove === 'function') {
        item.remove()
      } else {
        // fallback: remove by index
        const idx = cart.items.findIndex(it => String((it && (it._id || it.id))) === String(itemId))
        if (idx === -1) throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found in cart')
        cart.items.splice(idx, 1)
      }
    } else {
      // If .id isn't available or didn't find, remove by index
      const idx = cart.items.findIndex(it => String((it && (it._id || it.id))) === String(itemId))
      if (idx === -1) throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found in cart')
      cart.items.splice(idx, 1)
    }

    await cart.save()
    const populated = await cartModel.findOne({ owner: userId }).populate('items.productId').lean()
    return populated
  } catch (err) {
    // Log full error for diagnostics then rethrow an ApiError if needed
    console.error('[cartService] removeItem unexpected error:', err)
    if (err instanceof ApiError) throw err
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to remove item from cart')
  }
}

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)
  cart.items = []
  await cart.save()
  const populated = await cartModel.findOne({ owner: userId }).populate('items.productId').lean()
  return populated
}

export const cartService = { getCart, addItem, updateItem, removeItem, clearCart }
