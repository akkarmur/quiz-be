/**
 * @description
 * This function will check if a boolean value for a given key exists in the environment variables.
 * If it does not exist, it will return the value of the default parameter.
 * If it does exist, it will return true only if the value is 'true', otherwise it will return false.
 * @param {string} index - The key to look for in the environment variables.
 * @param {boolean} defaultval - The value to return if the key does not exist in the environment variables.
 * @returns {boolean} - The value of the environment variable, or the default value if it does not exist.
 */
const optionalLoadAsBoolean = (index: string, defaultval: boolean): boolean => {
  // Check if the key is not defined in the environment variables.
  if (typeof process.env[index] === 'undefined') {
    // If it is not defined, return the default value.
    return defaultval
  } else {
    // If it is defined, return true only if the value is 'true', otherwise return false.
    return process.env[index] === 'true'
  }
}

/**
 * @description
 * This function will check if a string value for a given key exists in the environment variables.
 * If it does not exist, it will return undefined.
 * If it does exist, it will return the value of the environment variable.
 * @param {string} index - The key to look for in the environment variables.
 * @returns {string | undefined} - The value of the environment variable if it exists, otherwise undefined.
 */
const optionalLoadAsString = (index: string): string | undefined => {
  // Check if the key is not defined in the environment variables.
  const value: string | undefined = process.env[index]
  // If it is not defined, return undefined.
  return value
}

/**
 * @description
 * This function will check if a string value for a given key exists in the environment variables.
 * If it does not exist, it will throw an error.
 * If it does exist, it will return the value of the environment variable.
 * @param {string} index - The key to look for in the environment variables.
 * @returns {string} - The value of the environment variable if it exists, otherwise throw an error.
 */
const loadAsString = (index: string): string => {
  // Check if the key is not defined in the environment variables.
  const value: string | undefined = process.env[index]
  // If it is not defined, throw an error.
  if (value === undefined) {
    throw new Error(`${index} must be set!`)
  }
  // If it is defined, return the value of the environment variable.
  return value
}

/**
 * @description
 * This function will check if a number value for a given key exists in the environment variables.
 * If it does not exist, it will throw an error.
 * If it does exist, it will return the number value of the environment variable.
 * @param {string} index - The key to look for in the environment variables.
 * @returns {number} - The number value of the environment variable if it exists, otherwise throw an error.
 */
const loadAsNumber = (index: string): number => {
  // Check if the key is not defined in the environment variables.
  const value: string | undefined = process.env[index]
  // If the value is not defined, throw an error.
  if (value === undefined) {
    throw new Error(`${index} must be set as number!`)
  }
  // Attempt to convert the value to a number.
  const asNumber = Number(value)
  // If the value cannot be converted to a number, throw an error.
  if (isNaN(asNumber)) {
    throw new Error(`${index} must be set as number!`)
  }
  // If the value can be converted to a number, return the number.
  return asNumber
}

// This type defines the structure of the environment configuration object.
// Each property corresponds to a specific environment variable required by the application.
type Env = {
  NODE_ENV: string // Environment mode (development, production, etc.)
  APPSERVER_PORT: number // Port number for the application server
  TIMEZONE: string // Default timezone setting
  LOG_LEVEL: string // Log level for logging (info, debug, etc.)
  DB_NAME: string // Database name
  DB_HOST: string // Database host address
  DB_PWD: string // Database password
  DB_PORT: number // Database port number
  DB_USER: string // Database username
  DB_SSL_REQUIRED: boolean // Whether SSL is required for database connection
  SEQUELIZE_SYNCHRONIZE: boolean // Sync option for Sequelize ORM
  JWT_HS512_OTP_SECRET: string // Secret for OTP JWT signing
  JWT_HS512_REFRESH_SECRET: string // Secret for refresh token JWT signing
  JWT_HS512_ACCESS_SECRET: string // Secret for access token JWT signing
  IMG_BASE_URL: string // Base URL for image resources
  IMG_BASE_PATH: string // Base path for image storage
  SMTP_HOST: string // SMTP server host
  SMTP_PORT: number // SMTP server port
  SMTP_EMAIL: string // SMTP email address for authentication
  SMTP_PASSWORD: string // SMTP password for authentication
  ERROR_LOG_RECEIVER_EMAIL: string | undefined // Email for receiving error logs, optional
}

export const env: Env = {
  NODE_ENV: loadAsString('NODE_ENV'),
  APPSERVER_PORT: loadAsNumber('APPSERVER_PORT'),
  LOG_LEVEL: loadAsString('LOG_LEVEL'),
  TIMEZONE: optionalLoadAsString('TIMEZONE') ?? 'Asia/Tokyo',
  DB_NAME: loadAsString('DB_NAME'),
  DB_HOST: loadAsString('DB_HOST'),
  DB_PWD: loadAsString('DB_PWD'),
  DB_PORT: loadAsNumber('DB_PORT'),
  DB_USER: loadAsString('DB_USER'),
  DB_SSL_REQUIRED: optionalLoadAsBoolean('DB_SSL_REQUIRED', true),
  SEQUELIZE_SYNCHRONIZE: optionalLoadAsBoolean('SEQUELIZE_SYNCHRONIZE', false),
  JWT_HS512_OTP_SECRET: loadAsString('JWT_HS512_OTP_SECRET'),
  JWT_HS512_REFRESH_SECRET: loadAsString('JWT_HS512_REFRESH_SECRET'),
  JWT_HS512_ACCESS_SECRET: loadAsString('JWT_HS512_ACCESS_SECRET'),
  IMG_BASE_URL: loadAsString('IMG_BASE_URL'),
  IMG_BASE_PATH: loadAsString('IMG_BASE_PATH'),
  SMTP_HOST: loadAsString('SMTP_HOST'),
  SMTP_PORT: loadAsNumber('SMTP_PORT'),
  SMTP_EMAIL: loadAsString('SMTP_EMAIL'),
  SMTP_PASSWORD: loadAsString('SMTP_PASSWORD'),
  ERROR_LOG_RECEIVER_EMAIL: optionalLoadAsString('ERROR_LOG_RECEIVER_EMAIL'),
}
