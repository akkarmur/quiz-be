import * as O from 'fp-ts/Option'
import { ForgotPasswordPatchReq } from '../../../../domain/entities/auth/forgot-password.interface'
import { GetOtpForVerifyPostReq } from '../../../../domain/entities/auth/sent-otp.interface'
import { mockAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.fixture'
import { mockUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.fixture'

export const mockForgotPasswordRequest: ForgotPasswordPatchReq = {
  email: 'test@example.com',
  otp: '123456',
  device_id: 'device123',
  password: 'newPassword123',
}

export const mockOtpInput: GetOtpForVerifyPostReq = {
  email: 'test@example.com',
  otp: '123456',
  device_id: 'device123',
}

export const mockExpiredOtp = {
  otp: '123456',
  email: 'test@example.com',
  created_at: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
}

export const mockValidOtp = {
  otp: '123456',
  email: 'test@example.com',
  created_at: new Date(),
}

export const mockAuthRepoInstance = mockAuthRepo
export const mockUserRepoInstance = mockUserRepo

// Mock repository methods
mockAuthRepoInstance.getOneOtp = jest
  .fn()
  .mockResolvedValue(O.some(mockValidOtp))
mockAuthRepoInstance.deleteOtp = jest.fn().mockResolvedValue(undefined)

mockUserRepoInstance.changePassword = jest.fn().mockResolvedValue(1)
