import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import {
  FindLoginReq,
  LoginDetails,
} from '../../../../../domain/entities/auth/login.interface'
import {
  GetDetailsForOtpDelete,
  GetOtpForVerifyPostReq,
  OtpGetDB,
  SentOtpPostReq,
} from '../../../../../domain/entities/auth/sent-otp.interface'
import { optionFormatForObject } from '../../../../helpers/fm-ts'
import Login from '../../../sequelize/entities/t_login'
import SentOtp from '../../../sequelize/entities/t_otp'
import { AuthRepoInterface } from './auth-repo.interface'

export const mysqlAuthRepo: AuthRepoInterface = {
  /**
   * Insert OTP into t_otp table
   * @param input SentOtpPostReq - The input object which contains the OTP details
   * @param t Transaction - The transaction object
   * @returns Promise<void> - Returns a promise which resolves to void
   */
  insertOtp: async (input: SentOtpPostReq, t: Transaction): Promise<void> => {
    await SentOtp.create(input as OtpGetDB, { transaction: t })
  },

  /**
   * Retrieve an OTP from the t_otp table
   * @param input GetOtpForVerifyPostReq - The input object which contains the OTP details
   * @returns Promise<O.Option<OtpGetDB>> - Returns a promise which resolves to an optional OTP from the database
   */
  getOneOtp: async (
    input: GetOtpForVerifyPostReq,
  ): Promise<O.Option<OtpGetDB>> => {
    // Query the database with the provided input parameters
    const otp = await SentOtp.findOne({
      attributes: ['created_at'],
      where: {
        email: input.email,
        otp: input.otp,
        device_id: input.device_id,
      },
    })
    // Wrap the result in an Option
    return optionFormatForObject(otp)
  },

  /**
   * Delete an OTP from the t_otp table
   * @param input GetDetailsForOtpDelete - The input object which contains the OTP deletion details
   * @param t Transaction - The transaction object
   * @returns Promise<void> - Returns a promise which resolves to void
   */
  deleteOtp: async (
    input: GetDetailsForOtpDelete,
    t: Transaction,
  ): Promise<void> => {
    // Delete the OTP entry that matches the provided email
    await SentOtp.destroy({
      where: {
        email: input.email,
      },
      transaction: t,
    })
  },

  /**
   * Retrieve login details from the t_login table
   * @param input FindLoginReq - The input object containing login request details
   * @returns Promise<O.Option<LoginDetails>> - Returns a promise that resolves to an optional LoginDetails object
   */
  getLoginDetails: async (
    input: FindLoginReq,
  ): Promise<O.Option<LoginDetails>> => {
    // Initialize the where condition with the input parameters
    const where: FindLoginReq = input

    // If a refresh_token is provided, add it to the where condition
    input.refresh_token && (where.refresh_token = input.refresh_token)

    // Query the database for login details matching the where condition
    const loginDetails = await Login.findOne({
      attributes: ['id', 'user_id', 'is_active'],
      where: where,
    })

    // Wrap the result in an Option and return
    return optionFormatForObject(loginDetails)
  },

  /**
   * Insert a new login details entry into the t_login table
   * @param input LoginDetails - The input object containing the login details
   * @param t Transaction - The transaction object
   * @returns Promise<void> - Returns a promise which resolves to void
   */
  insertLoginDetails: async (
    input: LoginDetails,
    t: Transaction,
  ): Promise<void> => {
    // Create a new Login entry in the database
    await Login.create(input, { transaction: t })
  },

  /**
   * Update a login details entry in the t_login table
   * @param input LoginDetails - The input object containing the login details
   * @param t Transaction - The transaction object
   * @returns Promise<void> - Returns a promise which resolves to void
   */
  updateLoginDetails: async (
    input: LoginDetails,
    t: Transaction,
  ): Promise<void> => {
    // Update the Login entry in the database with the provided input
    await Login.update(input, {
      where: {
        device_id: input.device_id,
      },
      transaction: t,
    })
  },
}
