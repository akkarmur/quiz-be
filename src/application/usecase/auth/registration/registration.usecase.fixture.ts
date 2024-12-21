import * as O from 'fp-ts/Option'
import { loginRes } from '../../../../domain/entities/auth/login.interface'
import { RegistrationPostReq } from '../../../../domain/entities/auth/registration.interface'
import { mockAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.fixture'
import { mockUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.fixture'

export const mockRegistrationRequest: RegistrationPostReq = {
  email: 'test@example.com',
  otp: '123456',
  name: 'Test User',
  password: 'password123',
  device_id: 'device123',
  device_token: 'deviceToken123',
  os: 'android',
}

export const mockRegistrationResponse: loginRes = {
  refresh_token: 'newRefreshToken',
  access_token: 'newAccessToken',
}

export const mockAuthRepoInstance = mockAuthRepo
export const mockUserRepoInstance = mockUserRepo

export const mockExistingLoginDetails = {
  user_id: 1,
  device_id: 'device123',
  is_active: true,
}

export const mockExpiredOtp = {
  otp: '123456',
  email: 'test@example.com',
  created_at: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
}

// Mock repository methods
mockUserRepoInstance.get = jest.fn().mockResolvedValue(O.none)
mockUserRepoInstance.createUser = jest.fn().mockResolvedValue({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
})
mockAuthRepoInstance.getOneOtp = jest.fn().mockResolvedValue(
  O.some({
    otp: '123456',
    email: 'test@example.com',
    created_at: new Date(),
  }),
)
mockAuthRepoInstance.deleteOtp = jest.fn().mockResolvedValue(undefined)
mockAuthRepoInstance.getLoginDetails = jest.fn().mockResolvedValue(O.none)
mockAuthRepoInstance.insertLoginDetails = jest.fn().mockResolvedValue(undefined)
mockAuthRepoInstance.updateLoginDetails = jest.fn().mockResolvedValue(undefined)
