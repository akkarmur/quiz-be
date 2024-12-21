import * as O from 'fp-ts/Option'
import User from '../../../sequelize/entities/m_user'
import {
  mockForgotPasswordUpdateDetails,
  mockPagination,
  mockRegistrationDbData,
  mockTransaction,
  mockUserGetDB,
  mockUserPatchReq,
} from './user-repo.fixture'
import { mysqlUserRepo } from './user.repo'

describe('mysqlUserRepo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create a new user record in the database', async () => {
      User.create = jest.fn().mockResolvedValue(mockRegistrationDbData)

      const result = await mysqlUserRepo.createUser(
        mockRegistrationDbData,
        mockTransaction,
      )

      expect(User.create).toHaveBeenCalledWith(mockRegistrationDbData, {
        transaction: mockTransaction,
      })
      expect(result).toEqual(mockRegistrationDbData)
    })
  })

  describe('get', () => {
    it('should retrieve a list of users from the database', async () => {
      User.findAll = jest.fn().mockResolvedValue([mockUserGetDB])

      const result = await mysqlUserRepo.get(mockPagination, mockTransaction)

      expect(User.findAll).toHaveBeenCalledWith({
        attributes: [
          'id',
          'name',
          'email',
          'is_active',
          'role',
          'profile_image',
          'created_at',
          'updated_at',
        ],
        where: expect.anything(),
        limit: mockPagination.limit,
        offset: mockPagination.offset,
        order: expect.anything(),
        transaction: mockTransaction,
      })
      expect(result).toEqual(O.some([mockUserGetDB]))
    })
  })

  describe('getCount', () => {
    it('should retrieve the count of users from the database', async () => {
      User.count = jest.fn().mockResolvedValue(10)

      const result = await mysqlUserRepo.getCount(
        mockPagination,
        mockTransaction,
      )

      expect(User.count).toHaveBeenCalledWith({
        where: expect.anything(),
        transaction: mockTransaction,
      })
      expect(result).toBe(10)
    })
  })

  describe('changePassword', () => {
    it('should update the password for a user in the database', async () => {
      User.update = jest.fn().mockResolvedValue([1])

      const result = await mysqlUserRepo.changePassword(
        mockForgotPasswordUpdateDetails,
        mockTransaction,
      )

      expect(User.update).toHaveBeenCalledWith(
        mockForgotPasswordUpdateDetails,
        {
          where: { email: mockForgotPasswordUpdateDetails.email },
          transaction: mockTransaction,
        },
      )
      expect(result).toBe(1)
    })
  })

  describe('updateUser', () => {
    it('should update a user record in the database', async () => {
      User.update = jest.fn().mockResolvedValue([1])

      await mysqlUserRepo.updateUser(mockUserPatchReq, mockTransaction)

      expect(User.update).toHaveBeenCalledWith(mockUserPatchReq, {
        where: { id: mockUserPatchReq.id },
        transaction: mockTransaction,
      })
    })
  })
})
