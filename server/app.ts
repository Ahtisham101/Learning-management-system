import express, { NextFunction, Request, Response } from "express"
export const app = express()
import cors from "cors"
import cookieParser from "cookie-parser"
import { ErrorHandlerMiddle } from "./middleware/error"
import userRouter from "./routes/user.route"
require("dotenv").config()
// body parser
// app.use(express.json({ limit: "1220mb " }))

// cookie parser

app.use(cookieParser())

// cors

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
)
//routes
app.use("/api/v1", userRouter)
//testing

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  })
})

// unknown routes

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any
  err.statusCode = 404
  next(err)
})
app.use(ErrorHandlerMiddle)
