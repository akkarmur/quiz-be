import { CONSTANTS } from '../../configs/constants/constants'
import transporter from './index'

/**
 * Sends an OTP to the specified email address.
 *
 * @param {string} email - The recipient's email address. This is the address where the OTP should be sent.
 * @param {string} otp - The OTP to be sent. This should be a 6-digit number.
 *
 * @returns {Promise<void>} - A promise that resolves when the email has been sent.
 *                            If the email cannot be sent, the promise is rejected with an error.
 */
export const sendOtpMail = async (
  email: string,
  otp: string,
): Promise<void> => {
  // Create the mail options that will be passed to the transporter
  const mailOptions = {
    // The sender's email address
    from: `"Quiz app"<${process.env.SMTP_EMAIL}>`,
    // The recipient's email address
    to: email,
    // The subject line of the email
    subject: 'Your OTP Code',
    // The plain text body of the email
    text: `Your OTP is ${otp}. It is valid for ${CONSTANTS.DEFAULT_VALUES.OTP_DURATION} minutes.`,
    // The HTML body of the email
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for <strong>${CONSTANTS.DEFAULT_VALUES.OTP_DURATION} minutes</strong>.</p>`,
  }

  // Use the transporter to send the email
  await transporter.sendMail(mailOptions)
}
