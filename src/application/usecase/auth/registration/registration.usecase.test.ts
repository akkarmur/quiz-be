import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import { generateJWTHS512Token } from '../../../../infrastructure/helpers/token/jwt-HS512.token'
import { registrationUseCase } from './registration.usecase'
import {
  mockAuthRepoInstance,
  mockExistingLoginDetails,
  mockExpiredOtp,
  mockRegistrationRequest,
  mockRegistrationResponse,
  mockUserRepoInstance,
} from './registration.usecase.fixture'

jest.mock('../../../../infrastructure/helpers/token/jwt-HS512.token')

jest.mock('../../../../infrastructure/helpers/hash/md5.hash', () => ({
  convertToMd5: jest.fn(() => 'hashedPassword'),
}))

describe('Registration Use Case', () => {
  let mockTransaction: Transaction

  beforeEach(() => {
    jest.clearAllMocks() // Clear mock call history, but preserve implementations
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
  })

  it('should successfully register a new user', async () => {
    ;(generateJWTHS512Token as jest.Mock)
      .mockReturnValueOnce('newRefreshToken')
      .mockReturnValueOnce('newAccessToken')
    const result = await registrationUseCase(
      mockRegistrationRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toEqual(mockRegistrationResponse)

      expect(mockUserRepoInstance.get).toHaveBeenCalled()
      expect(mockAuthRepoInstance.getOneOtp).toHaveBeenCalledWith(
        mockRegistrationRequest,
      )
      expect(mockAuthRepoInstance.deleteOtp).toHaveBeenCalledWith(
        mockRegistrationRequest,
        mockTransaction,
      )
      expect(mockAuthRepoInstance.insertLoginDetails).toHaveBeenCalled()
    }
  })

  it('should update login details if login already exists', async () => {
    ;(generateJWTHS512Token as jest.Mock)
      .mockReturnValueOnce('newRefreshToken')
      .mockReturnValueOnce('newAccessToken')
    ;(mockAuthRepoInstance.getLoginDetails as jest.Mock).mockResolvedValueOnce(
      O.some(mockExistingLoginDetails),
    )

    const result = await registrationUseCase(
      mockRegistrationRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(mockAuthRepoInstance.updateLoginDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 1,
          refresh_token: 'newRefreshToken',
          is_active: true,
          device_id: mockRegistrationRequest.device_id,
          device_token: mockRegistrationRequest.device_token,
          os: mockRegistrationRequest.os,
          created_by: '1',
          updated_by: '1',
        }),
        mockTransaction,
      )
      expect(mockAuthRepoInstance.insertLoginDetails).not.toHaveBeenCalled()
    }
  })

  it('should fail if the user already exists', async () => {
    ;(mockUserRepoInstance.get as jest.Mock).mockResolvedValueOnce(
      O.some([{ id: 1 }]),
    )

    const result = await registrationUseCase(
      mockRegistrationRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('ALREADY_EXIST')
    }
  })

  it('should fail if the OTP has expired', async () => {
    ;(mockAuthRepoInstance.getOneOtp as jest.Mock).mockResolvedValueOnce(
      O.some(mockExpiredOtp),
    )

    const result = await registrationUseCase(
      mockRegistrationRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('OTP_EXPIRED')
    }
  })

  it('should fail if the OTP is invalid', async () => {
    ;(mockAuthRepoInstance.getOneOtp as jest.Mock).mockResolvedValueOnce(O.none)

    const result = await registrationUseCase(
      mockRegistrationRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('OTP_INVALID')
    }
  })
})
