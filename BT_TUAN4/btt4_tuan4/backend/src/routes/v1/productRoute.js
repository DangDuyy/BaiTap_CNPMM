import express from 'express'
import { productController } from '~/controllers/productController'
import { productValidation } from '~/validations/productValidation'

const router = express.Router()

router.route('/')
  .get(productValidation.list, productController.listProducts)

router.route('/categories')
  .get(productController.categories)

router.route('/:id')
  .get(productController.getProduct)

export const productRoutes = router
