import { NextFunction, Request, Response } from 'express'
import * as E from 'fp-ts/Either'

import { HttpError } from '../../configs/commonDomains/HttpError'
import {
  ApplicationError,
  SuccessTag,
} from '../../configs/constants/application-tag'
import { StatusCodes } from '../../configs/constants/statusCodes'
import logger from '../logger'

type HttpSuccessResponse = {
  message?: string
  data?: any
}

type HttpErrorResponse = {
  message?: string
  errorData?: string | object
}

/**
 * Function  Response error
 * @param error error object
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export function errorResponse(
  error: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Create an object to store the error response. The error response will have
  // the following properties:
  //
  //   - message: an error message to display to the user
  //   - errorData: an optional object with additional error information
  //
  // If the error is a custom error (i.e. an instance of the HttpError class),
  // then we will use the information from the error object to construct the
  // error response. If the error is not a custom error, then we will log the
  // error to the console and return a generic 500 Internal Server Error response.
  //
  const apiError: HttpErrorResponse = {
    message: req.__('INTERNAL_SERVER_ERROR'),
  }

  // If the error is a custom error, then we will use the information from the
  // error object to construct the error response.
  if (error instanceof HttpError) {
    apiError.message = req.__(error.message, error.field!)
    apiError.errorData = error.errorData
    res.status(error.statusCode).send(apiError)
  } else {
    // If the error is not a custom error, then we will log the error to the
    // console and return a generic 500 Internal Server Error response.
    //
    logger.error(`[${new Date().toISOString()}]`, error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: req.__('INTERNAL_SERVER_ERROR'),
    })
  }

  // Call the next function to indicate that the error has been handled.
  //
  next()
}

/**
 * Sends a successful response back to the client.
 *
 * @param _req The Express Request object. This is not used in this function, but is included as a parameter
 *              for consistency with other functions in this module.
 * @param res The Express Response object.
 * @param statusCode The HTTP status code to return to the client.
 * @param message A message to include in the response body.
 * @param data An optional data object to include in the response body.
 */
export function successResponse(
  _req: Request,
  res: Response,
  statusCode: StatusCodes,
  message: string,
  data?: any,
): void {
  /**
   * Create an object to hold the response data. This object will be sent back to
   * the client in the response body.
   */
  const response: HttpSuccessResponse = {}

  /**
   * If data is provided, add it to the response object. Otherwise, just include
   * the message.
   */
  if (data) {
    /**
     * Add the message to the response object.
     */
    response.message = message

    /**
     * Add the data to the response object.
     */
    response.data = data
  } else {
    /**
     * If no data is provided, just include the message in the response object.
     */
    response.message = message
  }

  /**
   * Send the response back to the client with the specified status code.
   */
  res.status(statusCode).json(response)
}

/**
 * Creates a new HttpError instance for a given status code, tag, optional field object and optional error data.
 *
 * @param {number} statusCode The HTTP status code of the error. This is the numerical value of the status code, such as 404 or 500.
 * @param {string} tag The tag of the error. This is a string that describes the type of error, such as "NOT_FOUND" or "INTERNAL_SERVER_ERROR". This string is used to look up a translation for the error message, and is used to construct the error message that is sent back to the client.
 * @param {object} [field] An optional object containing additional information about the error. This object is typically used to provide additional information about the error, such as the name of a field that caused the error, or information about the type of error. For example, if the error is a validation error, this object might contain information about the validation rules that were violated.
 * @param {any} [errorData] An optional value containing additional information about the error. This value can be a string, an object, an array, or any other type of value. It is used to provide additional information about the error to the client.
 * @param {boolean} [custom=false] An optional boolean indicating whether the error is a custom error or not. If true, the error will be passed through to the next middleware in the chain. Otherwise, the error will be handled by the error-handling middleware in this module, which will log the error and send a response back to the client.
 * @returns {HttpError} The new HttpError instance
 */
export const formatError = (
  statusCode: number,
  tag: string,
  field?: { [key: string]: any },
  errorData?: any,
  custom?: boolean,
): HttpError => {
  /**
   * Creates a new HttpError instance with the given properties.
   *
   * @param {object} props The properties of the error. This object should contain the following properties:
   *                        - statusCode: The HTTP status code of the error.
   *                        - message: An object containing the tag and field properties.
   *                        - errorData: An optional value containing additional information about the error.
   *                        - custom: An optional boolean indicating whether the error is a custom error or not.
   * @returns {HttpError} The new HttpError instance
   */
  const error = new HttpError({
    statusCode,
    message: {
      tag,
      field,
    },
    errorData,
    custom,
  })

  /**
   * Return the new HttpError instance.
   */
  return error
}

/**
 * Handles the result of a usecase, sending a successful response with the given data,
 * or passing the error to the next middleware in the chain.
 *
 * @param {Request} req The request
 * @param {Response} res The response
 * @param {NextFunction} next The next middleware in the chain
 * @param {StatusCodes} statusCode The status code to send in the response
 * @param {SuccessTag} tag The tag for the success message
 * @param {E.Either<ApplicationError, D>} data The result of the usecase
 */
export const handleResult = <D>(
  req: Request,
  res: Response,
  next: NextFunction,
  statusCode: StatusCodes,
  tag: SuccessTag,
  data: E.Either<ApplicationError, D>,
): void => {
  // If the result is an error, pass it to the next middleware in the chain
  if (E.isLeft(data)) {
    next(data.left)
    return
  }

  // The result is not an error, so send a successful response with the data
  const response: HttpSuccessResponse = {}
  if (data.right) {
    response.message = req.__(tag)
    response.data = data.right
  } else {
    response.message = req.__(tag)
  }

  // Send the response
  res.status(statusCode).json(response)
}
