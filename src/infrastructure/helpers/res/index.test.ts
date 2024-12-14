import { NextFunction, Request, Response } from 'express'
import * as E from 'fp-ts/Either'
import { errorResponse, formatError, handleResult, successResponse } from '.'
import { HttpError } from '../../configs/commonDomains/HttpError'
import { StatusCodes } from '../../configs/constants/statusCodes'

jest.mock('../logger', () => ({
  error: jest.fn(),
}))

describe('Response Utilities', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      __: jest.fn().mockImplementation((key: string) => key),
    }

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    nextFunction = jest.fn()
  })

  describe('errorResponse', () => {
    it('should handle custom HttpError with custom message and error data', () => {
      const error = new HttpError({
        statusCode: StatusCodes.BAD_REQUEST,
        message: { tag: 'BAD_REQUEST_TAG' },
        custom: true,
      })

      errorResponse(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'BAD_REQUEST_TAG',
      })
      expect(nextFunction).toHaveBeenCalled()
    })

    it('should log and return generic error for non-custom errors', () => {
      const error = new Error('Generic Error')

      errorResponse(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'INTERNAL_SERVER_ERROR',
      })
      expect(nextFunction).toHaveBeenCalled()
    })

    it('should handle HttpError without custom message', () => {
      const error = new HttpError({
        statusCode: StatusCodes.FORBIDDEN,
        message: { tag: 'FORBIDDEN_ERROR' },
        custom: false,
      })

      errorResponse(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'INTERNAL_SERVER_ERROR',
      })
      expect(nextFunction).toHaveBeenCalled()
    })
  })

  describe('successResponse', () => {
    it('should send a success response with data', () => {
      const data = { key: 'value' }

      successResponse(
        mockRequest as Request,
        mockResponse as Response,
        StatusCodes.OK,
        'Success Message',
        data,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Success Message',
        data,
      })
    })

    it('should send a success response without data', () => {
      successResponse(
        mockRequest as Request,
        mockResponse as Response,
        StatusCodes.OK,
        'Success Message',
      )

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Success Message',
      })
    })
  })

  describe('handleResult', () => {
    it('should handle success case and send response with data', () => {
      const data = E.right({ key: 'value' })

      handleResult(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
        StatusCodes.OK,
        'OK',
        data,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'OK',
        data: { key: 'value' },
      })
    })

    it('should handle success case and send response without data', () => {
      const data = E.right(null)

      handleResult(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
        StatusCodes.NO_CONTENT,
        'DATA_DELETED_SUCCESSFULLY',
        data,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'DATA_DELETED_SUCCESSFULLY',
      })
    })

    it('should handle failure case', () => {
      const data = E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))

      handleResult(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
        StatusCodes.NO_CONTENT,
        'DATA_DELETED_SUCCESSFULLY',
        data,
      )

      expect(mockResponse.status).not.toHaveBeenCalled
    })
  })

  describe('formatError', () => {
    it('should create an HttpError with the given parameters', () => {
      const error = formatError(
        StatusCodes.BAD_REQUEST,
        'BAD_REQUEST',
        { field: 'email' },
        { additional: 'info' },
        true,
      )

      expect(error).toBeInstanceOf(HttpError)
      expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(error.message).toEqual('BAD_REQUEST')
      expect(error.errorData).toEqual({ additional: 'info' })
      expect(error.custom).toBe(true)
    })
  })
})
