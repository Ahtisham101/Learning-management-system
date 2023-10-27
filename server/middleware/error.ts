import { NextFunction, Request, Response } from "express"
import ErrorHandler from "../utils/ErrorHandler"

export const ErrorHandlerMiddle = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || "internal server error"

  if (err.name === "CastError") {
    const message = `Response not found. Invails: ${err.path}`
    err = new ErrorHandler(message, 400)
  }
  //dublicate key error
  if (err.code === 11000) {
    const message = `Dublicate ${Object.keys(err.keyValues)} entered`
    err = new ErrorHandler(message, 400)
  }
  // jsonWebToken error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again`
    err = new ErrorHandler(message, 400)
  }
  // token expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired, try again`
    err = new ErrorHandler(message, 400)
  }
  res.status(err.statusCode).json({
    success: true,
    message: err.message,
  })
}
