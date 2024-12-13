import * as O from 'fp-ts/Option'
import {
  FindLoginReq,
  loginRes,
} from '../../../../domain/entities/auth/login.interface'
import { mockAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.fixture'
import { mockUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.fixture'

export const mockRefreshTokenRequest: FindLoginReq = {
  user_id: 1,
  device_id: 'device123',
  refresh_token: 'validRefreshToken',
}

export const mockRefreshTokenResponse: loginRes = {
  refresh_token: 'newRefreshToken',
  access_token: 'newAccessToken',
}

export const mockInvalidRefreshTokenRequest: FindLoginReq = {
  user_id: 1,
  device_id: 'invalidDevice',
  refresh_token: 'invalidRefreshToken',
}

export const mockAuthRepoInstance = mockAuthRepo
export const mockUserRepoInstance = mockUserRepo

// Mock repository methods
mockAuthRepoInstance.getLoginDetails = jest
  .fn()
  .mockResolvedValue(
    O.some({ refresh_token: 'validRefreshToken', is_active: true }),
  )
mockAuthRepoInstance.updateLoginDetails = jest.fn().mockResolvedValue(undefined)
mockUserRepoInstance.get = jest
  .fn()
  .mockResolvedValue(O.some([{ id: 1, email: 'test@example.com' }]))
