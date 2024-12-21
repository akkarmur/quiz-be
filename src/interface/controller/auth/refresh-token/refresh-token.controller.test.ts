import { NextFunction, Request, Response } from 'express'
import { refreshTokenUseCase } from '../../../../application/usecase/auth/refresh-token/refresh-token.usecase'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo'
import { refreshTokenController } from './refresh-token.controller'
import {
  mockErrorFixture,
  mockRequestFixture,
  mockResponseFixture,
  mockTransactionFixture,
} from './refresh-token.controller.fixture'

jest.mock(
  '../../../../application/usecase/auth/refresh-token/refresh-token.usecase',
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

describe('RefreshTokenController', () => {
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

  it('should handle successful token refresh', async () => {
    const refreshResponse = {
      access_token: 'newAccessToken123',
      refresh_token: 'newRefreshToken123',
    }

    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async (callback) => callback(mockTransactionFixture),
    )
    ;(refreshTokenUseCase as jest.Mock).mockResolvedValueOnce(refreshResponse)

    await refreshTokenController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(mysqlCommonRepo.wrapInWorkUnitCtx).toHaveBeenCalledTimes(1)
    expect(refreshTokenUseCase).toHaveBeenCalledWith(
      {
        device_id: mockRequest.body.device_id,
        user_id: 'user123',
        refresh_token: 'mockedToken',
      },
      mysqlAuthRepo,
      mysqlUserRepo,
      mockTransactionFixture,
    )
    expect(handleResult).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction,
      StatusCodes.OK,
      'OK',
      refreshResponse,
    )
  })

  it('should call next with error on failure', async () => {
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async () => {
        throw mockErrorFixture
      },
    )

    await refreshTokenController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(nextFunction).toHaveBeenCalledWith(mockErrorFixture)
  })
})
