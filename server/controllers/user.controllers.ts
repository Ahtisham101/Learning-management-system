import { Request, Response, NextFunction } from "express"
import userModel, { IUser } from "../models/user.model"
import ErrorHandter from "../utils/ErrorHandler"
import { CatchAsyncError } from "../middleware/catchAsyncError"
import jwt, { Secret } from "jsonwebtoken"
import ejs from "ejs"
import path from "path"
import sendMail from "../utils/sendMail"
require("dotenv").config()
interface iRegistrationBody {
  name: string
  email: string
  password: string
  avatar?: string
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req)
      const { name, email, password } = req.body
     
      const isEmailExist = await userModel.findOne({ email })
      if (isEmailExist) {
        return next(new ErrorHandter("Email already exist", 400))
      }
      const user: iRegistrationBody = {
        name,
        email,
        password,
      }
      const activationToken = createActivationToken(user)
      const activationCode = activationToken.activationCode
      const data = { user: { name: user.name }, activationCode }
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      )
      // console.log(html)
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        })
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account`,
          activationToken: activationToken.token,
        })
      } catch (error: any) {
       
        return next(new ErrorHandter(error.message, 400))
      }
    } catch (error: any) {
      console.log(error.message)
      return next(new ErrorHandter(error.message, 400))
    }
  }
)

interface IActivationToken {
  token: string
  activationCode: string
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  )
  return { token, activationCode }
}
