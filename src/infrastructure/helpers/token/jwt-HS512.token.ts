import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import { StatusCodes } from '../../configs/constants/statusCodes'
import { formatError } from '../res'

/**
 * Generates a JWT token with HS512 algorithm.
 *
 * @param {object} input - The payload data for the token.
 * @param {string} secret - The secret key for signing the token.
 * @param {number} expires - The expiration time for the token in seconds.
 * @returns {string} - The generated JWT token.
 */
export const generateJWTHS512Token = <P>(
  input: P,
  secret: string,
  expires: number,
) => {
  const payload = input as object
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS512',
    expiresIn: expires,
  })
  return token
}

/**
 * Middleware for verifying JWT tokens with HS512 algorithm.
 *
 * @param {string} secret - The secret key for verifying the token.
 * @param {string[]} roles - Optional array of roles to check for authorization.
 * @returns {void} - Calls the next middleware if verification is successful.
 */
export const verifyJWTHS512Middleware =
  (secret: string, roles?: string[], compulsory?: boolean) =>
  (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['authorization'] as string
    token = token?.replace('Bearer ', '')
    try {
      const values = jwt.verify(token, secret)
      if (values) {
        res.locals.user = values
        if (roles) {
          if (roles.indexOf(res.locals.user.role) === -1) {
            const errorType = formatError(
              StatusCodes.UNAUTHORIZED,
              'UNAUTHORIZED',
            )
            next(errorType)
          }
        }
        next()
      }
    } catch (error: any) {
      if (compulsory === false && !token) {
        return next()
      }
      let errorType
      if (error instanceof jwt.TokenExpiredError) {
        /**
         * For Expired Token (token timed out)
         */
        errorType = formatError(StatusCodes.UNAUTHORIZED, 'TOKEN_EXPIRED')
      } else if (error instanceof jwt.JsonWebTokenError) {
        /**
         * Invalid token or signature (tempered token)
         */
        errorType = formatError(StatusCodes.UNAUTHORIZED, 'TOKEN_INVALID')
      } else if (error instanceof jwt.NotBeforeError) {
        /**
         * For current time before creation time
         */
        errorType = formatError(StatusCodes.UNAUTHORIZED, 'TOKEN_PREDATED')
      } else {
        /**
         * For any other error
         */
        errorType = formatError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED')
      }
      next(errorType)
    }
  }
