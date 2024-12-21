import * as O from 'fp-ts/Option'
import { GuestUserRegistrationPostReq } from '../../../../domain/entities/user/guest-user-put.interface'
import { mockAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.fixture'

export const mockGuestUserRequest: GuestUserRegistrationPostReq = {
  device_id: 'device123',
  device_token: 'token123',
  os: 'android',
}

export const mockGuestUserRequestWithoutToken: GuestUserRegistrationPostReq = {
  device_id: 'device123',
  os: 'ios',
}

export const mockAuthRepoInstance = mockAuthRepo

// Mock repository methods
mockAuthRepoInstance.getLoginDetails = jest.fn().mockResolvedValue(O.none)
mockAuthRepoInstance.insertLoginDetails = jest.fn().mockResolvedValue(undefined)
mockAuthRepoInstance.updateLoginDetails = jest.fn().mockResolvedValue(undefined)
