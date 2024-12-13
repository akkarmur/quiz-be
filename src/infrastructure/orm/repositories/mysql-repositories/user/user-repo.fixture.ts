import { UserGetDB } from '../../../../../domain/entities/user/user-get.interface'
import { USER_ROLES } from '../../../../configs/constants/enums'
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
