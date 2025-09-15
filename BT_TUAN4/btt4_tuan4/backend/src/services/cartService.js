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
  const item = cart.items.id(itemId)
  if (!item) throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found')
  if (quantity <= 0) item.remove()
  else item.quantity = quantity
  await cart.save()
  const populated = await cartModel.findOne({ owner: userId }).populate('items.productId').lean()
  return populated
}

const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId)
  console.log('[cartService] removeItem user:', userId, 'itemId:', itemId)
  if (!Types.ObjectId.isValid(itemId)) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid itemId')
  const item = cart.items.id(itemId)
  if (!item) throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found in cart')
  item.remove()
  await cart.save()
  const populated = await cartModel.findOne({ owner: userId }).populate('items.productId').lean()
  return populated
}

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)
  cart.items = []
  await cart.save()
  const populated = await cartModel.findOne({ owner: userId }).populate('items.productId').lean()
  return populated
}

export const cartService = { getCart, addItem, updateItem, removeItem, clearCart }
