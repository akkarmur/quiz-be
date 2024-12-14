import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'
import {
  getDataFromReq,
  orderByValidationRegExp,
  searchNumberValidation,
  searchStringValidation,
  validation,
} from '.'
import { StatusCodes } from '../../configs/constants/statusCodes'

jest.mock('../res', () => ({
  formatError: jest.fn((statusCode, message, context) => ({
    statusCode,
    message,
    context,
  })),
}))

describe('validation middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
    }

    mockResponse = {}
    nextFunction = jest.fn()

    jest.clearAllMocks()
  })

  it('should call next if validation passes', () => {
    const schema = Joi.object({ name: Joi.string().required() })
    mockRequest.body = { name: 'Test' }

    const middleware = validation(schema)
    middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith()
  })

  it('should call next with an error if validation fails', () => {
    const schema = Joi.object({ name: Joi.string().required() })
    mockRequest.body = { age: 25 }

    const middleware = validation(schema)
    middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: StatusCodes.BAD_REQUEST,
        message: expect.any(String),
      }),
    )
  })

  it('should extract data from the specified source', () => {
    const schema = Joi.object({ age: Joi.number().required() })
    mockRequest.query = { age: '30' }

    const middleware = validation(schema, 'query')
    middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith()
  })

  it('should handle complex schema validation errors', () => {
    const schema = Joi.object({
      nested: Joi.object({
        field: Joi.string().required(),
      }).required(),
    })

    mockRequest.body = {}

    const middleware = validation(schema)
    middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: StatusCodes.BAD_REQUEST,
        context: expect.objectContaining({ field: 'nested' }),
      }),
    )
  })
})

describe('getDataFromReq', () => {
  let mockRequest: Partial<Request>

  beforeEach(() => {
    mockRequest = {
      body: { name: 'testBody' },
      query: { name: 'testQuery' },
      params: { id: '123' },
      file: {
        fieldname: 'file',
        buffer: Buffer.from('fileData'),
      } as Express.Multer.File,
      files: [
        { fieldname: 'file1', buffer: Buffer.from('fileData1') },
        { fieldname: 'file2', buffer: Buffer.from('fileData2') },
      ] as Express.Multer.File[],
    }
  })

  it('should extract data from body', () => {
    const result = getDataFromReq(mockRequest as Request, 'body')
    expect(result).toEqual({ name: 'testBody' })
  })

  it('should extract data from query', () => {
    const result = getDataFromReq(mockRequest as Request, 'query')
    expect(result).toEqual({ name: 'testQuery' })
  })

  it('should extract data from params', () => {
    const result = getDataFromReq(mockRequest as Request, 'params')
    expect(result).toEqual({ id: '123' })
  })

  it('should extract data from formData with a single file', () => {
    const result = getDataFromReq(mockRequest as Request, 'formData')
    expect(result).toEqual({
      name: 'testBody',
      file: { fieldname: 'file', buffer: Buffer.from('fileData') },
      file1: [{ fieldname: 'file1', buffer: Buffer.from('fileData1') }],
      file2: [{ fieldname: 'file2', buffer: Buffer.from('fileData2') }],
    })
  })

  it('should extract data from formData with multiple files', () => {
    delete mockRequest.file // Remove single file to test multiple files case

    const result = getDataFromReq(mockRequest as Request, 'formData')
    expect(result).toEqual({
      name: 'testBody',
      file1: [{ fieldname: 'file1', buffer: Buffer.from('fileData1') }],
      file2: [{ fieldname: 'file2', buffer: Buffer.from('fileData2') }],
    })
  })

  it('should combine query and params with body as a fallback', () => {
    const result = getDataFromReq(mockRequest as Request)
    expect(result).toEqual({
      name: 'testQuery',
      id: '123',
    })
  })
})

describe('orderByValidationRegExp', () => {
  it('should generate a valid regex for orderBy validation', () => {
    const validFields = ['name', 'age']
    const regex = orderByValidationRegExp(validFields)

    expect('name | asc').toMatch(regex)
    expect('age | desc').toMatch(regex)
    expect('invalid | asc').not.toMatch(regex)
  })
})

describe('searchStringValidation', () => {
  it('should validate search strings correctly', () => {
    const regex = searchStringValidation()

    expect('field | like').toMatch(regex)
    expect('field | equals').toMatch(regex)
    expect('field | invalid').not.toMatch(regex)
    expect('field').toMatch(regex)
  })
})

describe('searchNumberValidation', () => {
  it('should validate search numbers correctly', () => {
    const regex = searchNumberValidation()

    expect('123 | equals').toMatch(regex)
    expect('123.45 | greater_than').toMatch(regex)
    expect('invalid | less_than').not.toMatch(regex)
    expect('123').toMatch(regex)
  })
})
