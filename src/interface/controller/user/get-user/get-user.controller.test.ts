import { NextFunction, Request, Response } from 'express'
import { getUserUseCase } from '../../../../application/usecase/user/get-user/get-user.usecase'
import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'

import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { getUserController } from './get-user.controller'
import {
  mockErrorFixture,
  mockRequestFixture,
  mockResponseFixture,
  mockUserUseCaseResponse,
} from './get-user.controller.fixture'

jest.mock('../../../../application/usecase/user/get-user/get-user.usecase')
jest.mock('../../../../infrastructure/helpers/res')
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo',
)

describe('getUserController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = { query: { ...mockRequestFixture.query } }
    mockResponse = {
      ...mockResponseFixture,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch all active users for admin role', async () => {
    mockResponse!.locals!.user.role = USER_ROLES.ADMIN
    ;(getUserUseCase as jest.Mock).mockResolvedValue(mockUserUseCaseResponse)
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async (callback) => await callback({}),
    )

    await getUserController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(mysqlCommonRepo.wrapInWorkUnitCtx).toHaveBeenCalledTimes(1)
    expect(getUserUseCase).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 10,
        offset: 0,
      }),
      expect.anything(),
      true,
      expect.anything(),
    )
    expect(handleResult).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction,
      expect.any(Number),
      'GET_USER_DETAILS_SUCCESS',
      mockUserUseCaseResponse,
    )
  })

  it('should fetch only the user’s own data for user role', async () => {
    mockResponse!.locals!.user.role = USER_ROLES.USER
    mockRequest!.query!.get_all = undefined
    ;(getUserUseCase as jest.Mock).mockResolvedValue(mockUserUseCaseResponse)
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async (callback) => await callback({}),
    )

    await getUserController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(getUserUseCase).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.arrayContaining([
          { name: 'id', value: '1', operation: 'equals' },
        ]),
      }),
      expect.anything(),
      false,
      expect.anything(),
    )
  })

  it('should handle errors gracefully', async () => {
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async () => {
        throw mockErrorFixture
      },
    )

    await getUserController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(nextFunction).toHaveBeenCalledWith(mockErrorFixture)
  })

  it('should fetch the user’s own data when get_all is not "true"', async () => {
    // Set user role to something other than USER_ROLES.ADMIN
    mockResponse!.locals!.user = {
      id: 1,
      role: USER_ROLES.ADMIN, // A non-admin role
    }

    // Set get_all to something other than 'true'
    mockRequest.query = { get_all: 'false' }

    // Mock use case and transaction wrapper
    ;(getUserUseCase as jest.Mock).mockResolvedValue(mockUserUseCaseResponse)
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async (callback) => await callback({}),
    )

    await getUserController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    // Assert that query.id is set to the user’s ID
    expect(getUserUseCase).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.arrayContaining([
          { name: 'id', value: '1', operation: 'equals' },
        ]),
      }),
      expect.anything(),
      false,
      expect.anything(),
    )

    // Ensure handleResult is called with the expected response
    expect(handleResult).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction,
      StatusCodes.OK,
      'GET_USER_DETAILS_SUCCESS',
      mockUserUseCaseResponse,
    )
  })
})
