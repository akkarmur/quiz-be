import { AuthRepoInterface } from './auth-repo.interface'

export const mockAuthRepo: AuthRepoInterface = {
  insertOtp: jest.fn(),
  getOneOtp: jest.fn(),
  deleteOtp: jest.fn(),
  getLoginDetails: jest.fn(),
  insertLoginDetails: jest.fn(),
  updateLoginDetails: jest.fn(),
}
