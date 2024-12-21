import { Transaction } from 'sequelize'
import { UserGetDB } from '../../../../../domain/entities/user/user-get.interface'
import { USER_ROLES } from '../../../../configs/constants/enums'
import User from '../../../sequelize/entities/m_user'
import { UserRepoInterface } from './user-repo.interface'

export const mockUserRepo: UserRepoInterface = {
  createUser: jest.fn(),
  get: jest.fn(),
  getCount: jest.fn(),
  changePassword: jest.fn(),
  updateUser: jest.fn(),
}

export const mockUser: UserGetDB = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: USER_ROLES.USER,
  is_active: 1,
  created_at: new Date(),
  updated_at: new Date(),
}

export const mockTransaction: Transaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
} as unknown as Transaction

export const mockRegistrationDbData = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword123',
  created_at: new Date(),
  updated_at: new Date(),
}

export const mockPagination = {
  fields: [{ name: 'name', value: 'Test User', operation: 'like' }],
  limit: 10,
  offset: 0,
  order: [{ field: 'created_at', direction: 'desc' as 'desc' }], // Explicit casting
}

export const mockUserGetDB = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  profile_image: 'test_image.png',
  role: 'USER',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
}

export const mockForgotPasswordUpdateDetails = {
  email: 'test@example.com',
  password: 'newHashedPassword123',
}

export const mockUserPatchReq = {
  id: 1,
  name: 'Updated User',
  profile_image: 'updated_image.png',
  updated_by: 'admin_user',
}

// Mock Sequelize model methods
User.create = jest.fn()
User.findAll = jest.fn()
User.count = jest.fn()
User.update = jest.fn()
