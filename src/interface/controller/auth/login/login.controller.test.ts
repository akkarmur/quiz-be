import { NextFunction, Request, Response } from 'express'
import { loginUseCase } from '../../../../application/usecase/auth/login/login.usecase'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo'
import { loginController } from './login.controller'
import {
  mockErrorFixture,
  mockRequestFixture,
  mockResponseFixture,
  mockTransactionFixture,
} from './login.controller.fixture'

jest.mock('../../../../application/usecase/auth/login/login.usecase')
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

describe('LoginController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = { ...mockRequestFixture }
    mockResponse = { ...mockResponseFixture }
    nextFunction = jest.fn()
    jest.clearAllMocks()
  })

  it('should handle successful login', async () => {
    const loginResponse = {
      refresh_token: 'refreshToken123',
      access_token: 'accessToken123',
    }

    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async (callback) => callback(mockTransactionFixture),
    )
    ;(loginUseCase as jest.Mock).mockResolvedValueOnce(loginResponse)

    await loginController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(mysqlCommonRepo.wrapInWorkUnitCtx).toHaveBeenCalledTimes(1)
    expect(loginUseCase).toHaveBeenCalledWith(
      mockRequest.body,
      mysqlUserRepo,
      mysqlAuthRepo,
      mockTransactionFixture,
    )
    expect(handleResult).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction,
      StatusCodes.OK,
      'LOGIN_SUCCESSFUL',
      loginResponse,
    )
  })

  it('should call next with error on failure', async () => {
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async () => {
        throw mockErrorFixture
      },
    )

    await loginController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(nextFunction).toHaveBeenCalledWith(mockErrorFixture)
  })
})
