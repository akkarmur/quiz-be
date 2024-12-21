import { Transaction } from 'sequelize'
import Login from '../../../sequelize/entities/t_login'
import Otp from '../../../sequelize/entities/t_otp'
import { AuthRepoInterface } from './auth-repo.interface'

export const mockAuthRepo: AuthRepoInterface = {
  insertOtp: jest.fn(),
  getOneOtp: jest.fn(),
  deleteOtp: jest.fn(),
  getLoginDetails: jest.fn(),
  insertLoginDetails: jest.fn(),
  updateLoginDetails: jest.fn(),
}

export const mockTransaction: Transaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
} as unknown as Transaction

export const mockSentOtp = {
  id: 1,
  email: 'test@example.com',
  otp: '123456',
  device_id: 'device123',
  created_at: new Date(),
  updated_at: new Date(),
}

export const mockInsertOtpInput = {
  email: 'test@example.com',
  otp: '123456',
  device_id: 'device123',
}

export const mockGetOtpInput = {
  email: 'test@example.com',
  otp: '123456',
  device_id: 'device123',
}

export const mockDeleteOtpInput = {
  email: 'test@example.com',
  otp: '123456',
  device_id: 'device123',
}

export const mockLoginDetails = {
  id: 1,
  user_id: 123,
  refresh_token: 'mockRefreshToken',
  device_id: 'device123',
  os: 'android',
  device_token: 'mockDeviceToken',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
}

export const mockFindLoginReq = {
  device_id: 'device123',
  refresh_token: 'mockRefreshToken',
}

// Mock Sequelize model methods
Otp.create = jest.fn()
Otp.findOne = jest.fn()
Otp.destroy = jest.fn()

Login.create = jest.fn()
Login.findOne = jest.fn()
Login.update = jest.fn()
