import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'

import { CONSTANTS } from '../../configs/constants/constants'
import { StatusCodes } from '../../configs/constants/statusCodes'
import { formatError } from '../res'

/**
 * A middleware that validates the request using a given joi schema.
 *
 * @param schema - The Joi schema to validate against.
 * @param from - The source of the request data to validate. Defaults to 'body'.
 * Can be 'body', 'query', 'params', or 'formData'.
 *
 * @returns A middleware function that validates the request data against the
 * given schema and calls next with an error if validation fails.
 */
export const validation = (
  schema: any,
  from?: 'body' | 'query' | 'params' | 'formData',
) => {
  /**
   * The middleware function that will be called by express.
   *
   * @param req - The request object.
   * @param _res - The response object (not used in this middleware).
   * @param next - The next function in the middleware chain.
   */
  return (req: Request, _res: Response, next: NextFunction) => {
    /**
     * Get the request data from the given source.
     *
     * @param req - The request object.
     * @param from - The source of the request data to get.
     */
    const data = getDataFromReq(req, from)

    /**
     * Validate the request data against the given schema.
     *
     * @param data - The request data to validate.
     * @param schema - The Joi schema to validate against.
     */
    const is_valid = schema.validate(data)

    /**
     * If the validation fails, create an error object with the appropriate
     * status code and message, and call next with the error.
     */
    if (is_valid.error) {
      /**
       * Get the tag of the error, which is the type of the error.
       *
       * @param error - The error object.
       */
      const tag = is_valid.error.details[0].type
        .split('.')
        .join('_')
        .toUpperCase()

      /**
       * Get the peers of the error, which are the other keys in the object that
       * are required if the current key is not present.
       *
       * @param error - The error object.
       */
      const peers = is_valid.error.details[0].context?.peers?.join(' or ')

      /**
       * Get the field of the error, which is the key in the object that caused
       * the error.
       *
       * @param error - The error object.
       */
      const pathArray: Array<string | number> = is_valid.error.details[0].path

      const field = pathArray
        .map((value) => {
          if (typeof value === 'number') {
            return `[${value}]`
          }
          return value
        })
        .join('.')
        .replace(/\.\[/g, '[')

      /**
       * Get the number of the error, which is the maximum number of items that
       * can be in an array.
       *
       * @param error - The error object.
       */
      const number =
        is_valid.error.details[0].context?.limit ||
        is_valid.error.details[0].context.valids

      /**
       * Create an error object with the appropriate status code and message.
       *
       * @param error - The error object.
       */
      const error = formatError(StatusCodes.BAD_REQUEST, tag, {
        ...is_valid.error.details[0].context,
        field,
        number,
        peers,
      })

      /**
       * Call next with the error object.
       *
       * @param error - The error object.
       */
      next(error)
    } else {
      /**
       * If the validation succeeds, call next without an error object.
       */
      next()
    }
  }
}

/**
 * Generates a regular expression for validating order by strings.
 *
 * @param {string[]} validOrderFields - An array of valid fields that can be used for ordering.
 * @returns {RegExp} A regular expression that matches strings with a valid field and direction.
 */
export const orderByValidationRegExp = (validOrderFields: string[]): RegExp => {
  // Concatenate valid fields into a string separated by '|'
  const validFields = validOrderFields.join('|')

  // Concatenate valid directions into a string separated by '|'
  const validDirections = CONSTANTS.VALIDATION.ORDER_DIRECTIONS.join('|')

  // Create and return a regular expression to match the pattern: "field | direction"
  return new RegExp(`^(${validFields}) \\| (${validDirections})$`)
}

/**
 * Generates a regular expression for validating search strings.
 *
 * The regular expression matches strings with either of the following patterns:
 *
 * 1. "field | like|equals|not_equals"
 * 2. "field"
 *
 * @returns {RegExp} A regular expression that matches strings with a valid search pattern.
 */
export const searchStringValidation = (): RegExp => {
  return new RegExp(/(^[^|]+\s\|\s(like|equals|not_equals)$)|(^[^|]+$)/)
}

/**
 * Generates a regular expression for validating search numbers.
 *
 * The regular expression matches strings with either of the following patterns:
 *
 * 1. "number | equals|not_equals|greater_than|less_than|greater_than_equals|less_than_equals"
 * 2. "number"
 *
 * @returns {RegExp} A regular expression that matches strings with a valid search pattern.
 */
export const searchNumberValidation = (): RegExp => {
  return new RegExp(
    /(^([0-9]+\.[0-9]+)|([0-9]+)+\s\|\s(equals|not_equals|greater_than|less_than|greater_than_equals|less_than_equals)$)|(^([0-9]+\.[0-9]+)|([0-9]+)+$)/,
  )
}

/**
 * Extracts data from the request object based on the specified source.
 *
 * @param {Request} req - The Express request object.
 * @param {'body' | 'query' | 'params' | 'formData'} [from] - The source of the data to extract.
 * @returns {object} The extracted data.
 */
export const getDataFromReq = (
  req: Request,
  from?: 'body' | 'query' | 'params' | 'formData',
): object => {
  let data

  switch (from) {
    case 'body':
      // Assign data from request body
      data = _.assign(req.body)
      break

    case 'query':
      // Assign data from request query parameters
      data = _.assign(req.query)
      break

    case 'params':
      // Assign data from request URL parameters
      data = _.assign(req.params)
      break

    case 'formData':
      {
        // Initialize data with request body
        const paramsData = { ...req.body }

        // If a single file is uploaded, add it to the data
        if (req.file) {
          paramsData[req.file.fieldname] = req.file
        }

        // If multiple files are uploaded, add them to the data
        if (req.files) {
          const files = req.files as Express.Multer.File[]
          for (const file of files) {
            if (!paramsData[file.fieldname]) {
              paramsData[file.fieldname] = []
            }
            paramsData[file.fieldname].push(file)
          }
        }

        // Assign the constructed paramsData
        data = _.assign(paramsData)
      }
      break

    default:
      {
        // Combine query and params with body as a fallback
        const paramsData = { ...req.query, ...req.params }
        data = _.assign(req.body, paramsData)
      }
      break
  }

  return data
}
