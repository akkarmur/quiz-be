import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { mockUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.fixture'
import { getUserUseCase } from './get-user.usecase'
import getUserFixture from './get-user.usecase.fixture'

describe('getUserUseCase', () => {
  let mockTransaction: Transaction

  beforeEach(() => {
    jest.clearAllMocks()
    mockTransaction = {} as Transaction
  })

  it('should return user data successfully', async () => {
    const { paginationInput, userRecords, userCount } = getUserFixture

    // Mock repository methods
    ;(mockUserRepo.get as jest.Mock).mockResolvedValue(O.some(userRecords))
    ;(mockUserRepo.getCount as jest.Mock).mockResolvedValue(userCount)

    const result = await getUserUseCase(
      paginationInput,
      mockUserRepo,
      true,
      mockTransaction,
    )

    // Assertions
    expect(E.isRight(result)).toBe(true)
    if (E.isRight(result)) {
      expect(result.right.totalCount).toBe(userCount)
      expect(result.right.data).toHaveLength(userRecords.length)
    }
    expect(mockUserRepo.get).toHaveBeenCalledWith(
      paginationInput,
      mockTransaction,
    )
    expect(mockUserRepo.getCount).toHaveBeenCalledWith(
      paginationInput,
      mockTransaction,
    )
  })

  it('should return an error when no data is found', async () => {
    const { paginationInput } = getUserFixture

    // Mock repository methods
    ;(mockUserRepo.get as jest.Mock).mockResolvedValue(O.none)
    ;(mockUserRepo.getCount as jest.Mock).mockResolvedValue(0)

    const result = await getUserUseCase(
      paginationInput,
      mockUserRepo,
      true,
      mockTransaction,
    )

    // Assertions
    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('NO_DATA_FOUND')
    }
    expect(mockUserRepo.get).toHaveBeenCalledWith(
      paginationInput,
      mockTransaction,
    )
  })
})
