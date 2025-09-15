import express from 'express'
import { cartController } from '~/controllers/cartController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { cartValidation } from '~/validations/cartValidation'

const router = express.Router()

router.use(authMiddleware.isAuthorized)

router.route('/')
  .get(cartController.getCart)
  .post(cartValidation.addItem, cartController.addItem)
  .delete(cartController.clear)

router.route('/:itemId')
  .put(cartValidation.updateItem, cartController.updateItem)
  .delete(cartController.removeItem)

export const cartRoutes = router
