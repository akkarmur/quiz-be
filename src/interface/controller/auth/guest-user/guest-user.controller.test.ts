import { NextFunction, Request, Response } from 'express'
import { guestUserUseCase } from '../../../../application/usecase/auth/guest-user/guest-user.usecase'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'

import { guestUserController } from './guest-user.controller'
import {
  mockErrorFixture,
  mockRequestFixture,
  mockResponseFixture,
  mockTransactionFixture,
} from './guest-user.controller.fixture'

jest.mock('../../../../application/usecase/auth/guest-user/guest-user.usecase')
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo',
)
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo',
)
jest.mock('../../../../infrastructure/helpers/res', () => ({
  handleResult: jest.fn(),
}))

describe('GuestUserController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = { ...mockRequestFixture }
    mockResponse = { ...mockResponseFixture }
    nextFunction = jest.fn()
    jest.clearAllMocks()
  })

  it('should handle successful guest user creation or update', async () => {
    const userId = 'user123'
    mockResponse.locals = { user: { id: userId } }
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async (callback) => callback(mockTransactionFixture),
    )
    ;(guestUserUseCase as jest.Mock).mockResolvedValueOnce({})

    await guestUserController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(mysqlCommonRepo.wrapInWorkUnitCtx).toHaveBeenCalledTimes(1)
    expect(guestUserUseCase).toHaveBeenCalledWith(
      mockRequest.body,
      mysqlAuthRepo,
      mockTransactionFixture,
      userId,
    )
    expect(handleResult).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction,
      StatusCodes.CREATED,
      'CREATED',
      {},
    )
  })

  it('should call next with error on failure', async () => {
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async () => {
        throw mockErrorFixture
      },
    )

    await guestUserController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(nextFunction).toHaveBeenCalledWith(mockErrorFixture)
  })
})
