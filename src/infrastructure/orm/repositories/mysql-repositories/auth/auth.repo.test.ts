import * as O from 'fp-ts/Option'
import Login from '../../../sequelize/entities/t_login'

import Otp from '../../../sequelize/entities/t_otp'
import {
  mockDeleteOtpInput,
  mockFindLoginReq,
  mockGetOtpInput,
  mockInsertOtpInput,
  mockLoginDetails,
  mockSentOtp,
  mockTransaction,
} from './auth-repo.fixture'
import { mysqlAuthRepo } from './auth.repo'

describe('mysqlAuthRepo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('insertOtp', () => {
    it('should insert an OTP into the t_otp table', async () => {
      Otp.create = jest.fn().mockResolvedValue(undefined)

      await mysqlAuthRepo.insertOtp(mockInsertOtpInput, mockTransaction)

      expect(Otp.create).toHaveBeenCalledWith(mockInsertOtpInput, {
        transaction: mockTransaction,
      })
    })
  })

  describe('getOneOtp', () => {
    it('should retrieve an OTP from the t_otp table', async () => {
      Otp.findOne = jest.fn().mockResolvedValue(mockSentOtp)

      const result = await mysqlAuthRepo.getOneOtp(mockGetOtpInput)

      expect(Otp.findOne).toHaveBeenCalledWith({
        attributes: ['created_at'],
        where: {
          email: mockGetOtpInput.email,
          otp: mockGetOtpInput.otp,
          device_id: mockGetOtpInput.device_id,
        },
      })
      expect(result).toEqual(O.some(mockSentOtp))
    })

    it('should return none if OTP is not found', async () => {
      Otp.findOne = jest.fn().mockResolvedValue(null)

      const result = await mysqlAuthRepo.getOneOtp(mockGetOtpInput)

      expect(result).toEqual(O.none)
    })
  })

  describe('deleteOtp', () => {
    it('should delete an OTP from the t_otp table', async () => {
      Otp.destroy = jest.fn().mockResolvedValue(undefined)

      await mysqlAuthRepo.deleteOtp(mockDeleteOtpInput, mockTransaction)

      expect(Otp.destroy).toHaveBeenCalledWith({
        where: { email: mockDeleteOtpInput.email },
        transaction: mockTransaction,
      })
    })
  })

  describe('getLoginDetails', () => {
    it('should retrieve login details from the t_login table', async () => {
      Login.findOne = jest.fn().mockResolvedValue(mockLoginDetails)

      const result = await mysqlAuthRepo.getLoginDetails(mockFindLoginReq)

      expect(Login.findOne).toHaveBeenCalledWith({
        attributes: ['id', 'user_id', 'is_active'],
        where: mockFindLoginReq,
      })
      expect(result).toEqual(O.some(mockLoginDetails))
    })

    it('should return none if login details are not found', async () => {
      Login.findOne = jest.fn().mockResolvedValue(null)

      const result = await mysqlAuthRepo.getLoginDetails(mockFindLoginReq)

      expect(result).toEqual(O.none)
    })
  })

  describe('insertLoginDetails', () => {
    it('should insert login details into the t_login table', async () => {
      Login.create = jest.fn().mockResolvedValue(undefined)

      await mysqlAuthRepo.insertLoginDetails(mockLoginDetails, mockTransaction)

      expect(Login.create).toHaveBeenCalledWith(mockLoginDetails, {
        transaction: mockTransaction,
      })
    })
  })

  describe('updateLoginDetails', () => {
    it('should update login details in the t_login table', async () => {
      Login.update = jest.fn().mockResolvedValue([1])

      await mysqlAuthRepo.updateLoginDetails(mockLoginDetails, mockTransaction)

      expect(Login.update).toHaveBeenCalledWith(mockLoginDetails, {
        where: { device_id: mockLoginDetails.device_id },
        transaction: mockTransaction,
      })
    })
  })
})
