import { NextFunction, Request, Response } from 'express'
import { sentOtpUseCase } from '../../../../application/usecase/auth/send-otp/sent-otp.usecase'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { sentOtpController } from './sent-otp.controller'
import {
  mockErrorFixture,
  mockRequestFixture,
  mockResponseFixture,
  mockTransactionFixture,
} from './sent-otp.controller.fixture'

jest.mock('../../../../application/usecase/auth/send-otp/sent-otp.usecase')
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo',
)
jest.mock(
  '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo',
)
jest.mock('../../../../infrastructure/helpers/res', () => ({
  handleResult: jest.fn(),
}))

describe('SentOtpController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = { ...mockRequestFixture }
    mockResponse = { ...mockResponseFixture }
    nextFunction = jest.fn()
    jest.clearAllMocks()
  })

  it('should handle successful OTP sent', async () => {
    const sentOtpResponse = {
      message: 'OTP sent successfully',
    }

    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async (callback) => callback(mockTransactionFixture),
    )
    ;(sentOtpUseCase as jest.Mock).mockResolvedValueOnce(sentOtpResponse)

    await sentOtpController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(mysqlCommonRepo.wrapInWorkUnitCtx).toHaveBeenCalledTimes(1)
    expect(sentOtpUseCase).toHaveBeenCalledWith(
      mockRequest.body,
      mysqlAuthRepo,
      mockTransactionFixture,
    )
    expect(handleResult).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction,
      StatusCodes.CREATED,
      'OTP_SENT_SUCCESSFULLY',
      sentOtpResponse,
    )
  })

  it('should call next with error on failure', async () => {
    ;(mysqlCommonRepo.wrapInWorkUnitCtx as jest.Mock).mockImplementation(
      async () => {
        throw mockErrorFixture
      },
    )

    await sentOtpController(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(nextFunction).toHaveBeenCalledWith(mockErrorFixture)
  })
})
