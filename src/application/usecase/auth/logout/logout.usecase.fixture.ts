import { FindLoginReq } from '../../../../domain/entities/auth/login.interface'
import { mockAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.fixture'

export const mockLogoutRequest: FindLoginReq = {
  user_id: 1,
  device_id: 'device123',
  refresh_token: 'validRefreshToken',
}

export const mockAuthRepoInstance = mockAuthRepo

// Mock repository methods
mockAuthRepoInstance.updateLoginDetails = jest.fn().mockResolvedValue(undefined)
