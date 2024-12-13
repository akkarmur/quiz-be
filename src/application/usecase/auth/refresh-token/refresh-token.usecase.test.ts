import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'

import { Transaction } from 'sequelize'

import { refreshTokenUseCase } from './refresh-token.usecase'
import {
  mockAuthRepoInstance,
  mockRefreshTokenRequest,
  mockRefreshTokenResponse,
  mockUserRepoInstance,
} from './refresh-token.usecase.fixture'

jest.mock('../../../../infrastructure/helpers/token/jwt-HS512.token', () => ({
  generateJWTHS512Token: jest
    .fn()
    .mockImplementationOnce(() => 'newRefreshToken') // For refresh token
    .mockImplementationOnce(() => 'newAccessToken'), // For access token
}))

describe('Refresh Token Use Case', () => {
  let mockTransaction: Transaction

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
  })

  it('should successfully generate a new access and refresh token', async () => {
    const result = await refreshTokenUseCase(
      mockRefreshTokenRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toEqual(mockRefreshTokenResponse)
      expect(mockAuthRepoInstance.getLoginDetails).toHaveBeenCalledWith(
        mockRefreshTokenRequest,
      )
      expect(mockUserRepoInstance.get).toHaveBeenCalled()
      expect(mockAuthRepoInstance.updateLoginDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockRefreshTokenRequest.user_id,
          device_id: mockRefreshTokenRequest.device_id,
          refresh_token: 'newRefreshToken',
        }),
        mockTransaction,
      )
    }
  })

  it('should fail if login details are not found', async () => {
    ;(mockAuthRepoInstance.getLoginDetails as jest.Mock).mockResolvedValueOnce(
      O.none,
    )

    const result = await refreshTokenUseCase(
      mockRefreshTokenRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('UNAUTHORIZED')
    }
  })

  it('should fail if user details are not found', async () => {
    ;(mockUserRepoInstance.get as jest.Mock).mockResolvedValueOnce(O.none)

    const result = await refreshTokenUseCase(
      mockRefreshTokenRequest,
      mockAuthRepoInstance,
      mockUserRepoInstance,
      mockTransaction,
    )

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('UNAUTHORIZED')
    }
  })
})
