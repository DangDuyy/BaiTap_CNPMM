import cartModel from '~/models/carts'
import productModel from '~/models/products'
import { Types } from 'mongoose'

const getOrCreateCart = async (userId) => {
  let cart = await cartModel.findOne({ owner: userId })
  if (!cart) cart = await cartModel.create({ owner: userId, items: [] })
  return cart
}

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId)
  return cart
}

const addItem = async (userId, productId, quantity = 1) => {
  const cart = await getOrCreateCart(userId)
  if (!Types.ObjectId.isValid(productId)) throw new Error('Invalid productId')

  const product = await productModel.findById(productId).lean()
  if (!product) throw new Error('Product not found')

  const existing = cart.items.find(it => it.productId.toString() === productId.toString())
  if (existing) {
    existing.quantity = existing.quantity + Number(quantity)
  } else {
    cart.items.push({ productId, name: product.name, price: product.price, quantity })
  }

  await cart.save()
  return cart
}

const updateItem = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId)
  const item = cart.items.id(itemId)
  if (!item) throw new Error('Item not found')
  if (quantity <= 0) item.remove()
  else item.quantity = quantity
  await cart.save()
  return cart
}

const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId)
  const item = cart.items.id(itemId)
  if (item) item.remove()
  await cart.save()
  return cart
}

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId)
  cart.items = []
  await cart.save()
  return cart
}

export const cartService = { getCart, addItem, updateItem, removeItem, clearCart }
