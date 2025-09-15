import { productService } from '~/services/productService'
import { StatusCodes } from 'http-status-codes'

const listProducts = async (req, res, next) => {
  try {
    const { page, itemsPerPage, ...filters } = req.query
    const result = await productService.getProducts(filters, page, itemsPerPage)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await productService.getProductById(id)
    if (!product) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found' })
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
  }
}

const categories = async (req, res, next) => {
  try {
    const list = await productService.getCategories()
    res.status(StatusCodes.OK).json(list)
  } catch (error) {
    next(error)
  }
}

export const productController = { listProducts, getProduct, categories }
