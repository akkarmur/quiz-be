import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { uploadImage } from '../../../../infrastructure/helpers/fs'
import { mockUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.fixture'
import { updateUserUseCase } from './update-user.usecase'
import updateUserFixture from './update-user.usecase.fixture'

jest.mock('../../../../infrastructure/helpers/fs')

describe('updateUserUseCase', () => {
  let mockTransaction: Transaction

  beforeEach(() => {
    jest.clearAllMocks()
    mockTransaction = {} as Transaction
  })

  it('should update the user successfully', async () => {
    const { validInput, existingUser } = updateUserFixture

    // Mock repository methods
    ;(mockUserRepo.get as jest.Mock).mockResolvedValue(O.some([existingUser]))
    ;(mockUserRepo.updateUser as jest.Mock).mockResolvedValue(undefined)

    const result = await updateUserUseCase(
      mockUserRepo,
      validInput,
      mockTransaction,
    )

    // Assertions
    expect(E.isRight(result)).toBe(true)
    expect(mockUserRepo.get).toHaveBeenCalledWith(
      {
        fields: [{ name: 'id', value: validInput.id, operation: 'equals' }],
        limit: undefined,
        offset: undefined,
        order: [],
      },
      mockTransaction,
    )
    expect(mockUserRepo.updateUser).toHaveBeenCalledWith(
      validInput,
      mockTransaction,
    )
  })

  it('should return an error when user does not exist', async () => {
    const { validInput } = updateUserFixture

    // Mock repository methods
    ;(mockUserRepo.get as jest.Mock).mockResolvedValue(O.none)

    const result = await updateUserUseCase(
      mockUserRepo,
      validInput,
      mockTransaction,
    )

    // Assertions
    expect(E.isLeft(result)).toBe(true)
    if (E.isLeft(result)) {
      expect(result.left.message).toBe('USER_NOT_EXISTS')
    }
    expect(mockUserRepo.get).toHaveBeenCalledWith(
      {
        fields: [{ name: 'id', value: validInput.id, operation: 'equals' }],
        limit: undefined,
        offset: undefined,
        order: [],
      },
      mockTransaction,
    )
  })

  it('should handle image upload and update the user successfully', async () => {
    const { inputWithImage, existingUser, updatedInput } = updateUserFixture

    // Mock repository methods
    ;(mockUserRepo.get as jest.Mock).mockResolvedValue(O.some([existingUser]))
    ;(mockUserRepo.updateUser as jest.Mock).mockResolvedValue(undefined)

    // Mock image upload
    ;(uploadImage as jest.Mock).mockResolvedValue({
      fileName: 'uploaded/profile.png',
    })

    const result = await updateUserUseCase(
      mockUserRepo,
      inputWithImage,
      mockTransaction,
    )

    // Assertions
    expect(E.isRight(result)).toBe(true)
    expect(uploadImage).toHaveBeenCalledWith(
      inputWithImage.image,
      expect.any(String),
    )
  })
})
