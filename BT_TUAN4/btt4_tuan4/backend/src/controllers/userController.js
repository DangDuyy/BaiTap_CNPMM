import { StatusCodes } from "http-status-codes"
import { userService } from "~/services/userService"
import ApiError from "~/utils/ApiError"
import ms from "ms"
import { env } from "~/config/environment"
const createNew = async (req, res, next) => {
  try {
    const result = await userService.createNew(req.body)
    return res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    const isProd = env.BUILD_MODE === 'production'
    const accessTokenLife = env.ACCESS_TOKEN_LIFE || '1h'
    const refreshTokenLife = env.REFRESH_TOKEN_LIFE || '14 days'

    const commonCookie = {
      httpOnly: true,
      secure: isProd, // only true on HTTPS
      sameSite: isProd ? 'none' : 'lax'
    }

    res.cookie('accessToken', result.accessToken, {
      ...commonCookie,
      maxAge: ms(accessTokenLife)
    })

    res.cookie('refreshToken', result.refreshToken, {
      ...commonCookie,
      maxAge: ms(refreshTokenLife)
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ loggedOut: true })
  }
  catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)

    //gui accesstoken moi dua tren refreshToken
    const isProd = env.BUILD_MODE === 'production'
    const accessTokenLife = env.ACCESS_TOKEN_LIFE || '1h'
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: ms(accessTokenLife)
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign in again! (Error from refreshToken) '))
  }
}

const sendOtp = async (req, res, next) => {
  try {
    // stub: in real app: generate OTP, save to user, send via email/SMS
    const { email } = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await userService.saveOtp(email, otp)
    res.status(StatusCodes.OK).json({ sent: true, otp })
  } catch (error) { next(error) }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await userService.saveResetToken(email, otp)
    res.status(StatusCodes.OK).json({ sent: true })
  } catch (error) { next(error) }
}

const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body
    await userService.resetPassword({ email, token, newPassword })
    res.status(StatusCodes.OK).json({ reset: true })
  } catch (error) { next(error) }
}
export const userController = {
  createNew,
  login,
  verifyAccount,
  logout,
  refreshToken
  , sendOtp, forgotPassword, resetPassword
}