import { StatusCodes } from '../constants/statusCodes'

/**
 * Custom Error class for HTTP errors
 *
 * @property {string} message - The error message
 * @property {StatusCodes} statusCode - The HTTP status code
 * @property {{ [key: string]: any }} field - The field that caused the error
 * @property {string | object} errorData - The data to be returned in the error response
 * @property {boolean} custom - Whether the error is a custom error or not
 */
export class HttpError extends Error {
  message = 'INTERNAL_SERVER_ERROR'
  statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
  field?: { [key: string]: any }
  errorData?: any
  custom?: boolean

  /**
   * Creates a new HttpError instance
   *
   * @param {{
   *   statusCode: number,
   *   message: { tag: string; field?: { [key: string]: any } },
   *   errorData?: string,
   *   custom?: boolean,
   * }} error - The error object
   */
  constructor(error: {
    statusCode: number
    message: { tag: string; field?: { [key: string]: any } }
    errorData?: string
    custom?: boolean
  }) {
    // Call the parent constructor with the error message
    // This is necessary to set the error message on the error object
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    super(error.errorData)

    // Set the prototype of the error object to the new target's prototype
    // This is necessary to ensure that the error object is an instance of the
    // HttpError class
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
    Object.setPrototypeOf(this, new.target.prototype)

    // Set the properties of the error object
    this.message = error.message.tag
    this.field = error.message.field
    this.statusCode = error.statusCode
    this.errorData = error.errorData
    this.custom = error.custom

    // Capture the stack trace of the error
    // This is necessary to get the correct stack trace when printing the error
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/captureStackTrace
    Error.captureStackTrace(this)
  }
}
