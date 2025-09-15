import { StatusCodes } from "http-status-codes"
import { pickUser } from "~/utils/formatter"
import bcryptjs from 'bcryptjs'
import { JwtProvider } from "~/providers/JwtProvider"
import ApiError from "~/utils/ApiError"
import { env } from "~/config/environment"
import userModel from "~/models/users"
import { v4 as uuidv4 } from 'uuid'
import { res } from 'process'

const createNew = async (reqBody) => {
  try {
    const exist = await userModel.findOne({ email: reqBody.email })
    if (exist) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email already registered')

    const hashed = bcryptjs.hashSync(reqBody.password, 10)
    const verifyToken = uuidv4().split('-')[0]

    const newUser = await userModel.create({
      email: reqBody.email,
      password: hashed,
      userName: reqBody.username || reqBody.email,
      verifyToken,
      isActive: false
    })

    // Here we would send verifyToken via email/SMS. For now return token in response for testing.
    return { ...pickUser(newUser), verifyToken }
  } catch (error) {
    throw error
  }
}

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOne({email: reqBody.email})

  if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
  if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is already active')
  if (reqBody.token !== existUser.verifyToken) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid')

    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const updateUser = await userModel.findByIdAndUpdate(existUser._id, { $set: updateData }, { new: true })
    return pickUser(updateUser)
  } catch (error) {
    throw new Error
  }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOne({email: reqBody.email})

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active')

    //bcrypt: so sanh pass truoc va sau khi hash
    if (!bcryptjs.compareSync(reqBody.password, existUser.password))
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email or password is incorrect')

    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    return { accessToken, refreshToken, ...pickUser(existUser)}
  } catch (error) {
    throw new Error(error)
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    //tao accesstoken moi
    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)

    return { accessToken }
  } catch (error) {
    throw new Error(error)
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken
}

const findById = async (id) => {
  try {
    const user = await userModel.findById(id).lean()
    if (!user) return null
    return pickUser(user)
  } catch (error) {
    throw error
  }
}

userService.findById = findById


// Extras for OTP / password reset
const saveOtp = async (email, otp) => {
  const user = await userModel.findOneAndUpdate({ email }, { $set: { verifyToken: otp } }, { new: true })
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
  return true
}

const saveResetToken = async (email, token) => {
  const user = await userModel.findOneAndUpdate({ email }, { $set: { resetToken: token, resetTokenAt: new Date() } }, { new: true })
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
  return true
}

const resetPassword = async ({ email, token, newPassword }) => {
  const user = await userModel.findOne({ email })
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
  if (!user.resetToken || user.resetToken !== token) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid token')
  // Optionally check expiration
  const hashed = bcryptjs.hashSync(newPassword, 10)
  user.password = hashed
  user.resetToken = null
  user.resetTokenAt = null
  await user.save()
  return true
}

// attach
userService.saveOtp = saveOtp
userService.saveResetToken = saveResetToken
userService.resetPassword = resetPassword