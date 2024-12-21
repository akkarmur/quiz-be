import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import { guestUserUseCase } from './guest-user.usecase'
import {
  mockAuthRepoInstance,
  mockGuestUserRequest,
  mockGuestUserRequestWithoutToken,
} from './guest-user.usecase.fixture'

describe('Guest User Use Case', () => {
  let mockTransaction: Transaction

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
  })

  it('should successfully register a new guest user when userId is not provided', async () => {
    const result = await guestUserUseCase(
      mockGuestUserRequest,
      mockAuthRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(mockAuthRepoInstance.getLoginDetails).toHaveBeenCalledWith({
        device_id: mockGuestUserRequest.device_id,
      })
      expect(mockAuthRepoInstance.insertLoginDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          device_id: mockGuestUserRequest.device_id,
          device_token: mockGuestUserRequest.device_token,
          os: mockGuestUserRequest.os,
          is_active: true,
          created_by: 'guest',
          updated_by: 'guest',
        }),
        mockTransaction,
      )
    }
  })

  it('should update created_by and updated_by with existing user_id when loginDetails exist', async () => {
    const existingUserId = 456

    ;(mockAuthRepoInstance.getLoginDetails as jest.Mock).mockResolvedValueOnce(
      O.some({ user_id: existingUserId }),
    )

    const result = await guestUserUseCase(
      mockGuestUserRequest,
      mockAuthRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(mockAuthRepoInstance.updateLoginDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          device_id: mockGuestUserRequest.device_id,
          device_token: mockGuestUserRequest.device_token,
          os: mockGuestUserRequest.os,
          is_active: true,
          created_by: String(existingUserId),
          updated_by: String(existingUserId),
        }),
        mockTransaction,
      )
    }
  })

  it('should handle guest user registration without device token', async () => {
    const result = await guestUserUseCase(
      mockGuestUserRequestWithoutToken,
      mockAuthRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(mockAuthRepoInstance.getLoginDetails).toHaveBeenCalledWith({
        device_id: mockGuestUserRequestWithoutToken.device_id,
      })
      expect(mockAuthRepoInstance.insertLoginDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          device_id: mockGuestUserRequestWithoutToken.device_id,
          os: mockGuestUserRequestWithoutToken.os,
          is_active: true,
          created_by: 'guest',
          updated_by: 'guest',
        }),
        mockTransaction,
      )
    }
  })

  it('should fallback to default created_by and updated_by when loginDetails.value.user_id is undefined', async () => {
    ;(mockAuthRepoInstance.getLoginDetails as jest.Mock).mockResolvedValueOnce(
      O.some({ user_id: undefined }),
    )

    const result = await guestUserUseCase(
      mockGuestUserRequest,
      mockAuthRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(mockAuthRepoInstance.updateLoginDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          created_by: 'guest', // Ensures created_by falls back to default
          updated_by: 'guest', // Ensures updated_by falls back to default
        }),
        mockTransaction,
      )
    }
  })
})
