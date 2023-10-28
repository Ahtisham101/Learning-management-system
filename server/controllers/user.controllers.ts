import { Request, Response, NextFunction } from "express"
import userModel, { IUser } from "../models/user.model"
import ErrorHandter from "../utils/ErrorHandler"
import { CatchAsyncError } from "../middleware/catchAsyncError"

interface iRegistrationBody {
  name: string
  email: string
  password: string
  avatar?: string
}
