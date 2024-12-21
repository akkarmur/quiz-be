import { createTransport } from 'nodemailer'

import { env } from '../../env'

const transporter = createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT, // or 587 fora TLS
  secure: true, // true for 465, false for other ports
  auth: {
    user: env.SMTP_EMAIL, // your SMTP email
    pass: env.SMTP_PASSWORD, // your SMTP email password
  },
})

export default transporter
