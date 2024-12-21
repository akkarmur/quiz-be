export const CONSTANTS = {
  DEFAULT_VALUES: {
    /**
     * Otp Duration must be in minutes
     */
    OTP_DURATION: 10,
    OTP_BODY: 'Your Quiz app verification code is: ',
    /**
     * Token duration must be given in seconds
     */
    OTP_TOKEN_DURATION: 600,
    /**
     * 1 year
     */
    REFRESH_TOKEN_DURATION: 31536000,
    /**
     * 1 day
     */
    ACCESS_TOKEN_DURATION: 86400,
    /**
     * Size in bits
     */
    IMAGE_SIZE: 10 * 1024 * 1024,
    USER_IMAGE_FOLDER: 'user',
    THUMBNAIL_SIZE: {
      width: 200,
      height: 200,
    },
  },
  VALIDATION: {
    /**
     * Validation direction
     */
    ORDER_DIRECTIONS: ['asc', 'desc'],
  },
  supportedLanguages: ['en', 'hi', 'gu'],
} as const
