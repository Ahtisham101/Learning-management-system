import nodemailer, { Transporter } from "nodemailer"
import ejs from "ejs"
import path from "path"
require("dotenv").config()
interface EmailOptions {
  email: string
  subject: string
  template: string
  data: { [key: string]: any }
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOTST,
    port: parseInt(process.env.SMTP_PORT || "2525"),
    service: process.env.SMTP_SERVICES,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })
  const { email, subject, template, data } = options
  const templatePath = path.join(__dirname, "../mails", template)
  const html: string = await ejs.renderFile(template, data)
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  }
  await transporter.sendMail(mailOptions)
}
export default sendMail
