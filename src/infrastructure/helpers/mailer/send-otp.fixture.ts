export const mockConstants = {
  DEFAULT_VALUES: {
    OTP_DURATION: 10,
    OTP_BODY: 'Your Quiz app verification code is: ',
    OTP_TOKEN_DURATION: 600,
    REFRESH_TOKEN_DURATION: 31536000,
    ACCESS_TOKEN_DURATION: 86400,
    IMAGE_SIZE: 10 * 1024 * 1024,
    USER_IMAGE_FOLDER: 'user',
    THUMBNAIL_SIZE: {
      width: 200,
      height: 200,
    },
  },
}

export const mockEmailData = {
  email: 'test@example.com',
  otp: '123456',
  mailOptions: {
    from: `"Quiz app"<${process.env.SMTP_EMAIL}>`,
    to: 'test@example.com',
    subject: 'Your OTP Code',
    text: 'Your OTP is 123456. It is valid for 10 minutes.',
    html: '<p>Your OTP is <strong>123456</strong>. It is valid for <strong>10 minutes</strong>.</p>',
  },
}
