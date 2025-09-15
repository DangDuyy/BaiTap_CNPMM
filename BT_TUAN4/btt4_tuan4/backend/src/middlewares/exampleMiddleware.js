import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
// import { env } from '~/config/environment'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req, res, next) => {
  // Ensure we have a statusCode
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Always log the error server-side so devs can inspect stack traces in logs
  // This is intentionally verbose in dev and still useful in production logs
  console.error('[errorHandlingMiddleware] Caught error:', {
    message: err.message,
    statusCode: err.statusCode,
    name: err.name,
    stack: err.stack,
  })

  const responseError = {
    message: err.message || StatusCodes[err.statusCode]
  }

  // In dev include more debug details in the JSON response
  if (env.BUILD_MODE === 'dev') {
    responseError.statusCode = err.statusCode
    responseError.name = err.name
    responseError.stack = err.stack
  }

  res.status(err.statusCode).json(responseError)
}