import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import { forgotPasswordUseCase } from './forgot-password.usecase'
import {
  mockAuthRepoInstance,
  mockExpiredOtp,
  mockForgotPasswordRequest,
  mockOtpInput,
  mockUserRepoInstance,
} from './forgot-password.usecase.fixture'

jest.mock('../../../../infrastructure/helpers/hash/md5.hash', () => ({
  convertToMd5: jest.fn(() => 'hashedPassword'),
}))

describe('Forgot Password Use Case', () => {
  let mockTransaction: Transaction

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
  })

  it('should successfully update the password', async () => {
    const result = await forgotPasswordUseCase(
      mockForgotPasswordRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(mockAuthRepoInstance.getOneOtp).toHaveBeenCalledWith(mockOtpInput)
      expect(mockAuthRepoInstance.deleteOtp).toHaveBeenCalledWith(
        mockOtpInput,
        mockTransaction,
      )
      expect(mockUserRepoInstance.changePassword).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockForgotPasswordRequest.email,
          password: 'hashedPassword',
        }),
        mockTransaction,
      )
    }
  })

  it('should fail if OTP is invalid', async () => {
    ;(mockAuthRepoInstance.getOneOtp as jest.Mock).mockResolvedValueOnce(O.none)

    const result = await forgotPasswordUseCase(
      mockForgotPasswordRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('OTP_INVALID')
    }
  })

  it('should fail if OTP has expired', async () => {
    ;(mockAuthRepoInstance.getOneOtp as jest.Mock).mockResolvedValueOnce(
      O.some(mockExpiredOtp),
    )

    const result = await forgotPasswordUseCase(
      mockForgotPasswordRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('OTP_EXPIRED')
    }
  })

  it('should fail if user is not registered', async () => {
    ;(mockUserRepoInstance.changePassword as jest.Mock).mockResolvedValueOnce(0)

    const result = await forgotPasswordUseCase(
      mockForgotPasswordRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('USER_NOT_REGISTERED')
    }
  })
})
