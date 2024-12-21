import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'

import { Transaction } from 'sequelize'

import { generateJWTHS512Token } from '../../../../infrastructure/helpers/token/jwt-HS512.token'
import { mockUser } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.fixture'
import { loginUseCase } from './login.usecase'
import {
  invalidLoginRequest,
  mockAuthRepoInstance,
  mockLoginRequest,
  mockLoginResponse,
  mockUserRepoInstance,
} from './login.usecase.fixture'

jest.mock('../../../../infrastructure/helpers/hash/md5.hash')
jest.mock('../../../../domain/entities/common/pagination')
jest.mock('../../../../infrastructure/helpers/token/jwt-HS512.token')

describe('Login Use Case', () => {
  let mockTransaction: Transaction

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
  })

  it('should successfully authenticate a user and return tokens', async () => {
    ;(generateJWTHS512Token as jest.Mock)
      .mockReturnValueOnce(mockLoginResponse.refresh_token)
      .mockReturnValueOnce(mockLoginResponse.access_token)

    const result = await loginUseCase(
      mockLoginRequest,
      mockUserRepoInstance,
      mockAuthRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right).toEqual(mockLoginResponse)
    }
  })

  it('should fail authentication for invalid credentials', async () => {
    ;(mockUserRepoInstance.get as jest.Mock).mockResolvedValueOnce(O.none)

    const result = await loginUseCase(
      invalidLoginRequest,
      mockUserRepoInstance,
      mockAuthRepoInstance,
      mockTransaction,
    )

    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('INVALID_CREDENTIALS')
    }
  })
  it('should handle existing login details update scenario', async () => {
    const existingLoginDetails = { user_id: mockUser.id }

    // Mock getLoginDetails to return existing login details
    ;(mockAuthRepoInstance.getLoginDetails as jest.Mock).mockResolvedValueOnce(
      O.some(existingLoginDetails),
    )

    // Mock other dependencies
    ;(generateJWTHS512Token as jest.Mock)
      .mockReturnValueOnce(mockLoginResponse.refresh_token)
      .mockReturnValueOnce(mockLoginResponse.access_token)

    const result = await loginUseCase(
      mockLoginRequest,
      mockUserRepoInstance,
      mockAuthRepoInstance,
      mockTransaction,
    )

    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(mockAuthRepoInstance.updateLoginDetails).toHaveBeenCalled()
    }
  })
})
