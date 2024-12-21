import { NextFunction, Request, Response } from 'express'
import { logoutUseCase } from '../../../../application/usecase/auth/logout/logout.usecase'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { logoutController } from './logout.controller'
import {
  mockErrorFixture,
  mockRequestFixture,
  mockResponseFixture,
  mockTransactionFixture,
} from './logout.controller.fixture'

jest.mock('../../../../application/usecase/auth/logout/logout.usecase')
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo',
)
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo',
)
jest.mock('../../../../infrastructure/helpers/res', () => ({
  handleResult: jest.fn(),
}))

describe('LogoutController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = { ...mockRequestFixture }
    mockResponse = { ...mockResponseFixture }
    mockResponse.locals = { user: { id: 'user123' } }
    nextFunction = jest.fn()
    jest.clearAllMocks()
  })

  it('should handle successful logout', async () => {
    const logoutResponse = {}

    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async (callback) => callback(mockTransactionFixture),
    )
    ;(logoutUseCase as jest.Mock).mockResolvedValueOnce(logoutResponse)

    await logoutController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(mysqlCommonRepo.wrapInWorkUnitCtx).toHaveBeenCalledTimes(1)
    expect(logoutUseCase).toHaveBeenCalledWith(
      {
        device_id: mockRequest.body.device_id,
        user_id: 'user123',
      },
      mysqlAuthRepo,
      mockTransactionFixture,
    )
    expect(handleResult).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction,
      StatusCodes.OK,
      'LOGOUT_SUCCESSFUL',
      logoutResponse,
    )
  })

  it('should call next with error on failure', async () => {
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async () => {
        throw mockErrorFixture
      },
    )

    await logoutController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(nextFunction).toHaveBeenCalledWith(mockErrorFixture)
  })
})
