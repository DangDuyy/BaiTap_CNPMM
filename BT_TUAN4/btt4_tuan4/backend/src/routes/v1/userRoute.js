import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/refresh-token')
  .get(userController.refreshToken)

Router.route('/logout')
  .delete(userController.logout)

Router.route('/me')
  .get(require('~/middlewares/authMiddleware').authMiddleware.isAuthorized, userController.me)

Router.route('/send-otp')
  .post(userController.sendOtp)

Router.route('/forgot-password')
  .post(userController.forgotPassword)

Router.route('/reset-password')
  .post(userController.resetPassword)

export const userRoutes = Router
