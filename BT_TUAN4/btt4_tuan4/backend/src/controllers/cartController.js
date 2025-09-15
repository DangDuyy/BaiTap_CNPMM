import { cartService } from '~/services/cartService'
import { StatusCodes } from 'http-status-codes'

const getCart = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    console.log('[cart] getCart request by user:', userId)
    const cart = await cartService.getCart(userId)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    next(error)
  }
}

const addItem = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { productId, quantity } = req.body
    console.log('[cart] addItem user:', userId, 'productId:', productId, 'quantity:', quantity)
    const cart = await cartService.addItem(userId, productId, quantity)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    next(error)
  }
}

const updateItem = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { itemId } = req.params
    const { quantity } = req.body
    console.log('[cart] updateItem user:', userId, 'itemId:', itemId, 'quantity:', quantity)
    const cart = await cartService.updateItem(userId, itemId, quantity)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    next(error)
  }
}

const removeItem = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { itemId } = req.params
    console.log('[cart] removeItem user:', userId, 'itemId:', itemId)
    const cart = await cartService.removeItem(userId, itemId)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    next(error)
  }
}

const clear = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const cart = await cartService.clearCart(userId)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    next(error)
  }
}

export const cartController = { getCart, addItem, updateItem, removeItem, clear }
