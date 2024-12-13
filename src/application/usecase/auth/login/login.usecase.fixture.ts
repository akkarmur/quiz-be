import * as O from 'fp-ts/Option'
import {
  LoginPostReq,
  loginRes,
} from '../../../../domain/entities/auth/login.interface'
import { mockAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.fixture'
import { AuthRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.interface'
import {
  mockUser,
  mockUserRepo,
} from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.fixture'

export const mockLoginRequest: LoginPostReq = {
  email: 'test@example.com',
  password: 'password123',
  device_id: 'device123',
  os: 'android',
}

export const mockLoginResponse: loginRes = {
  refresh_token: 'mockRefreshToken',
  access_token: 'mockAccessToken',
}

export const invalidLoginRequest: LoginPostReq = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
  device_id: 'device456',
  os: 'ios',
}

export const mockUserRepoInstance = mockUserRepo
export const mockAuthRepoInstance: AuthRepoInterface = mockAuthRepo

mockUserRepoInstance.get = jest.fn().mockResolvedValue(O.some([mockUser]))
mockAuthRepoInstance.getLoginDetails = jest.fn().mockResolvedValue(O.none)
mockAuthRepoInstance.insertLoginDetails = jest.fn().mockResolvedValue(undefined)
mockAuthRepoInstance.updateLoginDetails = jest.fn().mockResolvedValue(undefined)
