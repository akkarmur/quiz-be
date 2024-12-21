import { NextFunction, Request, Response } from 'express'

import { forgotPasswordUseCase } from '../../../../application/usecase/auth/forgot-password/forgot-password.usecase'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo'
import { forgotPasswordController } from './forgot-password.controller'
import {
  mockErrorFixture,
  mockRequestFixture,
  mockResponseFixture,
  mockTransactionFixture,
} from './forgot-password.controller.fixture'

jest.mock(
  '../../../../application/usecase/auth/forgot-password/forgot-password.usecase',
)
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo',
)
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo',
)
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo',
)
jest.mock('../../../../infrastructure/helpers/res', () => ({
  handleResult: jest.fn(),
}))

describe('ForgotPasswordController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = { ...mockRequestFixture }
    mockResponse = { ...mockResponseFixture }
    nextFunction = jest.fn()
    jest.clearAllMocks()
  })

  it('should handle successful password reset', async () => {
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async (callback) => callback(mockTransactionFixture),
    )
    ;(forgotPasswordUseCase as jest.Mock).mockResolvedValueOnce({})

    await forgotPasswordController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(mysqlCommonRepo.wrapInWorkUnitCtx).toHaveBeenCalledTimes(1)
    expect(forgotPasswordUseCase).toHaveBeenCalledWith(
      mockRequest.body,
      mysqlAuthRepo,
      mysqlUserRepo,
      mockTransactionFixture,
    )
    expect(handleResult).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction,
      StatusCodes.OK,
      'PASSWORD_RESET_SUCCESSFULLY',
      {},
    )
  })

  it('should call next with error on failure', async () => {
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async () => {
        throw mockErrorFixture
      },
    )

    await forgotPasswordController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(nextFunction).toHaveBeenCalledWith(mockErrorFixture)
  })
})
