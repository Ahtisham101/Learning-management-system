import mongoose, { Document, Model, Schema } from "mongoose"
import bcrypt from "bcryptjs"
const emaitRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+s/

export interface IUser extends Document {
  name: string
  email: string
  password: string
  avatar: {
    public_id: string
    url: string
  }
  public_id: string
  url: string
  role: string
  isVerified: boolean
  courses: Array<{ courseld: string }>
  comparePassword: (password: string) => Promise<boolean>
}
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emaitRegexPattern.test(value)
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter your passowrd"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseld: String,
      },
    ],
  },
  { timestamps: true }
)
//hash the passwrd
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})
//compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

const userModel: Model<IUser> = mongoose.model("User", userSchema)
export default userModel
