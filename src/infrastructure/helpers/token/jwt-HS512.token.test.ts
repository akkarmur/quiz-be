import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { StatusCodes } from '../../configs/constants/statusCodes'
import {
  generateJWTHS512Token,
  verifyJWTHS512Middleware,
} from './jwt-HS512.token'

jest.mock('jsonwebtoken')

jest.mock('../res', () => ({
  formatError: jest.fn((statusCode, message) => ({ statusCode, message })),
}))

describe('JWT Utils', () => {
  describe('generateJWTHS512Token', () => {
    it('should generate a JWT token with HS512 algorithm', () => {
      const payload = { user: 'test' }
      const secret = 'secretKey'
      const expires = 3600

      const mockToken = 'mock.jwt.token'
      jest.spyOn(jwt, 'sign').mockReturnValue(mockToken as unknown as void)

      const token = generateJWTHS512Token(payload, secret, expires)

      expect(jwt.sign).toHaveBeenCalledWith(payload, secret, {
        algorithm: 'HS512',
        expiresIn: expires,
      })
      expect(token).toBe(mockToken)
    })
  })

  describe('verifyJWTHS512Middleware', () => {
    let mockRequest: Request
    let mockResponse: Response
    let nextFunction: NextFunction

    beforeEach(() => {
      mockRequest = {
        headers: {},
      } as Request

      mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response

      nextFunction = jest.fn()
    })

    it('should verify a valid JWT token and add user to res.locals', () => {
      const secret = 'secretKey'
      const token = 'valid.jwt.token'
      const decodedToken = { role: 'admin' }

      mockRequest.headers['authorization'] = `Bearer ${token}`

      jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken as unknown as void)

      const middleware = verifyJWTHS512Middleware(secret)
      middleware(mockRequest, mockResponse, nextFunction)

      expect(jwt.verify).toHaveBeenCalledWith(token, secret)
      expect(mockResponse.locals.user).toEqual(decodedToken)
      expect(nextFunction).toHaveBeenCalled()
    })

    it('should return UNAUTHORIZED for invalid role', () => {
      const secret = 'secretKey'
      const token = 'valid.jwt.token'
      const decodedToken = { role: 'user' }

      mockRequest.headers['authorization'] = `Bearer ${token}`

      jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken as unknown as void)

      const middleware = verifyJWTHS512Middleware(secret, ['admin'])
      middleware(mockRequest, mockResponse, nextFunction)

      expect(jwt.verify).toHaveBeenCalledWith(token, secret)
      expect(nextFunction).toHaveBeenCalledWith({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'UNAUTHORIZED',
      })
    })

    it('should handle a TokenExpiredError', () => {
      const secret = 'secretKey'
      const token = 'expired.jwt.token'

      mockRequest.headers['authorization'] = `Bearer ${token}`

      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date())
      })

      const middleware = verifyJWTHS512Middleware(secret)
      middleware(mockRequest, mockResponse, nextFunction)

      expect(nextFunction).toHaveBeenCalledWith({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'TOKEN_EXPIRED',
      })
    })

    it('should handle a JsonWebTokenError', () => {
      const secret = 'secretKey'
      const token = 'invalid.jwt.token'

      mockRequest.headers['authorization'] = `Bearer ${token}`

      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token')
      })

      const middleware = verifyJWTHS512Middleware(secret)
      middleware(mockRequest, mockResponse, nextFunction)

      expect(nextFunction).toHaveBeenCalledWith({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'TOKEN_INVALID',
      })
    })

    it('should handle a NotBeforeError', () => {
      const secret = 'secretKey'
      const token = 'predated.jwt.token'

      mockRequest.headers['authorization'] = `Bearer ${token}`

      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new jwt.NotBeforeError('Token not active', new Date())
      })

      const middleware = verifyJWTHS512Middleware(secret)
      middleware(mockRequest, mockResponse, nextFunction)

      expect(nextFunction).toHaveBeenCalledWith({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'TOKEN_PREDATED',
      })
    })

    it('should handle missing token when compulsory is false', () => {
      const secret = 'secretKey'

      const middleware = verifyJWTHS512Middleware(secret, undefined, false)
      middleware(mockRequest, mockResponse, nextFunction)

      expect(nextFunction).toHaveBeenCalled()
    })

    it('should handle missing token when compulsory is true', () => {
      const secret = 'secretKey'

      const middleware = verifyJWTHS512Middleware(secret, undefined, true)
      middleware(mockRequest, mockResponse, nextFunction)

      expect(nextFunction).toHaveBeenCalledWith({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'TOKEN_PREDATED',
      })
    })
  })
})
