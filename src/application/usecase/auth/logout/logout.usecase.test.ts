import * as E from 'fp-ts/Either'
import { Transaction } from 'sequelize'

import { logoutUseCase } from './logout.usecase'
import {
  mockAuthRepoInstance,
  mockLogoutRequest,
} from './logout.usecase.fixture'

describe('Logout Use Case', () => {
  let mockTransaction: Transaction

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
  })

  it('should successfully log out the user', async () => {
    const result = await logoutUseCase(
      mockLogoutRequest,
      mockAuthRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(mockAuthRepoInstance.updateLoginDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockLogoutRequest.user_id,
          device_id: mockLogoutRequest.device_id,
          refresh_token: '',
          is_active: false,
        }),
        mockTransaction,
      )
    }
  })
})
